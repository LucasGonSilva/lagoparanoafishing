import { FormEvent, useEffect, useMemo, useState } from 'react'
import { api } from '../api'
import { toInputDateTime } from '../format'
import { itemLabel, resources, type Field } from './resources'

type Item = Record<string, unknown> & { id: number; active?: boolean; image_url?: string | null }

function emptyForm(fields: Field[]): Record<string, unknown> {
  const form: Record<string, unknown> = {}
  for (const field of fields) {
    if (field.kind === 'checkbox') {
      form[field.name] = true
    } else if (field.kind === 'number') {
      form[field.name] = field.name === 'year' ? new Date().getFullYear() : ''
    } else if (field.kind === 'select') {
      form[field.name] = field.options[0]?.value ?? ''
    } else if (field.kind === 'datetime' && field.name === 'published_at') {
      form[field.name] = toInputDateTime(new Date().toISOString())
    } else if (field.kind === 'photos' || field.kind === 'videos') {
      form[field.name] = []
    } else if ('defaultValue' in field && field.defaultValue) {
      form[field.name] = field.defaultValue
    } else {
      form[field.name] = ''
    }
  }
  return form
}

function formFromItem(fields: Field[], item: Item): Record<string, unknown> {
  const form: Record<string, unknown> = { id: item.id, image_url: item.image_url ?? '' }
  for (const field of fields) {
    const value = item[field.name]
    if (field.kind === 'datetime') {
      form[field.name] = toInputDateTime(typeof value === 'string' ? value : null)
    } else if (field.kind === 'date') {
      form[field.name] = typeof value === 'string' ? value.slice(0, 10) : ''
    } else if (field.kind === 'checkbox') {
      form[field.name] = Boolean(value)
    } else if (field.kind === 'photos' || field.kind === 'videos') {
      form[field.name] = Array.isArray(value) ? value : []
    } else if (field.kind === 'number') {
      form[field.name] = value === null || value === undefined || value === '' ? '' : value
    } else {
      form[field.name] = value ?? ''
    }
  }
  return form
}

function payloadFrom(fields: Field[], form: Record<string, unknown>): Record<string, unknown> {
  const payload: Record<string, unknown> = {}
  for (const field of fields) {
    const value = form[field.name]
    if (field.kind === 'checkbox') {
      payload[field.name] = Boolean(value)
    } else if (field.kind === 'photos') {
      payload[field.name] = Array.isArray(value)
        ? value.flatMap((item) => (item && typeof item === 'object' && 'path' in item && typeof item.path === 'string' ? [item.path] : []))
        : []
    } else if (field.kind === 'videos') {
      payload[field.name] = Array.isArray(value)
        ? value.flatMap((item) => {
            if (!item || typeof item !== 'object' || !('kind' in item)) {
              return []
            }
            if (item.kind === 'file' && 'path' in item && typeof item.path === 'string') {
              return [{ kind: 'file', path: item.path }]
            }
            if (item.kind === 'link' && 'url' in item && typeof item.url === 'string') {
              return [{ kind: 'link', url: item.url }]
            }
            return []
          })
        : []
    } else if (field.kind === 'number') {
      payload[field.name] = value === '' || value === null ? null : Number(value)
    } else if (value === '') {
      payload[field.name] = null
    } else {
      payload[field.name] = value
    }
  }
  return payload
}

export function ResourcePage({ type }: { type: string }) {
  const config = resources[type]
  const [items, setItems] = useState<Item[]>([])
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null)
  const [query, setQuery] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [videoLink, setVideoLink] = useState('')

  async function load() {
    const result = await api<{ data: Item[] }>(`/api/admin/content/${type}`)
    setItems(result.data)
  }

  useEffect(() => {
    load().catch((reason: Error) => setError(reason.message))
  }, [type])

  const visibleItems = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) {
      return items
    }
    return items.filter((item) => itemLabel(item).toLowerCase().includes(needle))
  }, [items, query])

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!editing) {
      return
    }
    const imageField = config.fields.find((field) => field.kind === 'image' && field.required)
    if (imageField && !editing[imageField.name]) {
      setError('Envie uma imagem antes de salvar.')
      return
    }
    setPending(true)
    setError(null)
    const body = JSON.stringify(payloadFrom(config.fields, editing))
    try {
      if (editing.id) {
        await api(`/api/admin/content/${type}/${editing.id}`, { method: 'PUT', body })
      } else {
        await api(`/api/admin/content/${type}`, { method: 'POST', body })
      }
      setEditing(null)
      await load()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível salvar.')
    } finally {
      setPending(false)
    }
  }

  async function remove(item: Item) {
    const label = itemLabel(item)
    if (!window.confirm(`Excluir "${label}"? Isso sai do site na hora.`)) {
      return
    }
    setError(null)
    try {
      await api(`/api/admin/content/${type}/${item.id}`, { method: 'DELETE' })
      await load()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível excluir.')
    }
  }

  async function upload(file: File, target: 'image' | 'photos' | 'videos' = 'image') {
    setUploading(true)
    setError(null)
    try {
      const body = new FormData()
      body.append('file', file)
      const result = await api<{ path: string; url: string; kind: 'image' | 'video' }>('/api/admin/uploads', { method: 'POST', body })
      if (target === 'photos' && result.kind !== 'image') {
        throw new Error('Essa vaga é só para foto.')
      }
      if (target === 'videos' && result.kind !== 'video') {
        throw new Error('Essa vaga é só para vídeo.')
      }
      setEditing((current) => {
        if (!current) {
          return current
        }
        if (target === 'photos') {
          const photos = Array.isArray(current.photos) ? current.photos : []
          return { ...current, photos: [...photos, { path: result.path, url: result.url }] }
        }
        if (target === 'videos') {
          const videos = Array.isArray(current.videos) ? current.videos : []
          return { ...current, videos: [...videos, { kind: 'file', path: result.path, url: result.url }] }
        }
        return { ...current, image_path: result.path, image_url: result.url }
      })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível enviar o arquivo.')
    } finally {
      setUploading(false)
    }
  }

  function addVideoLink() {
    const url = videoLink.trim()
    if (!/^https?:\/\//i.test(url)) {
      setError('O link do vídeo precisa começar com http:// ou https://.')
      return
    }
    setError(null)
    setEditing((current) => {
      if (!current) {
        return current
      }
      const videos = Array.isArray(current.videos) ? current.videos : []
      return { ...current, videos: [...videos, { kind: 'link', url }] }
    })
    setVideoLink('')
  }

  async function uploadFiles(files: File[], target: 'photos' | 'videos') {
    for (const file of files) {
      await upload(file, target)
    }
  }

  if (editing) {
    return (
      <form className="stack" onSubmit={onSubmit}>
        <div className="admin-top">
          <h1>{editing.id ? `Editar ${config.singular}` : (config.createTitle ?? `Nova ${config.singular}`)}</h1>
          <button className="btn btn-ghost" type="button" onClick={() => setEditing(null)}>Voltar</button>
        </div>
        {error && <p className="alert">{error}</p>}
        {config.fields.map((field) => {
          if (field.kind === 'checkbox') {
            return (
              <label className="check" key={field.name}>
                <input
                  type="checkbox"
                  checked={Boolean(editing[field.name])}
                  onChange={(event) => setEditing({ ...editing, [field.name]: event.target.checked })}
                />
                {field.label}
              </label>
            )
          }
          if (field.kind === 'image') {
            return (
              <div className="field" key={field.name}>
                <span>{field.label}</span>
                {typeof editing.image_url === 'string' && editing.image_url && (
                  <img className="preview" src={editing.image_url} alt="" />
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file) {
                      void upload(file)
                    }
                  }}
                />
                {uploading && <p className="hint">Enviando imagem…</p>}
              </div>
            )
          }
          if (field.kind === 'photos' || field.kind === 'videos') {
            const items = Array.isArray(editing[field.name]) ? editing[field.name] as Array<Record<string, string>> : []
            return (
              <div className="field" key={field.name}>
                <span>{field.label}</span>
                {items.length > 0 && (
                  <div className="media-grid">
                    {items.map((item, index) => (
                      <figure key={`${item.path ?? item.url}-${index}`}>
                        {field.kind === 'photos' && item.url && <img src={item.url} alt="" />}
                        {field.kind === 'videos' && item.kind === 'file' && item.url && <video src={item.url} muted />}
                        {field.kind === 'videos' && item.kind === 'link' && <p className="hint">{item.url}</p>}
                        <button
                          className="btn btn-danger"
                          type="button"
                          onClick={() => setEditing({
                            ...editing,
                            [field.name]: items.filter((_, itemIndex) => itemIndex !== index),
                          })}
                        >
                          Tirar
                        </button>
                      </figure>
                    ))}
                  </div>
                )}
                {field.kind === 'photos' ? (
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={(event) => {
                      const files = [...(event.target.files ?? [])]
                      event.target.value = ''
                      void uploadFiles(files, 'photos')
                    }}
                  />
                ) : (
                  <>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
                      onChange={(event) => {
                        const file = event.target.files?.[0]
                        event.target.value = ''
                        if (file) {
                          void upload(file, 'videos')
                        }
                      }}
                    />
                    <div className="video-link">
                      <input
                        type="url"
                        placeholder="https://"
                        value={videoLink}
                        onChange={(event) => setVideoLink(event.target.value)}
                      />
                      <button className="btn btn-ghost" type="button" onClick={addVideoLink}>Adicionar link</button>
                    </div>
                  </>
                )}
                {field.hint && <p className="hint">{field.hint}</p>}
                {uploading && <p className="hint">Enviando arquivo…</p>}
              </div>
            )
          }
          if (field.kind === 'select') {
            return (
              <label className="field" key={field.name}>
                <span>{field.label}</span>
                <select
                  value={String(editing[field.name] ?? '')}
                  onChange={(event) => setEditing({ ...editing, [field.name]: event.target.value })}
                >
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
            )
          }
          const inputType = field.kind === 'datetime' ? 'datetime-local' : field.kind === 'date' ? 'date' : field.kind === 'number' ? 'number' : 'text'
          return (
            <label className="field" key={field.name}>
              <span>{field.label}</span>
              {field.kind === 'textarea' ? (
                <textarea
                  required={field.required}
                  value={String(editing[field.name] ?? '')}
                  onChange={(event) => setEditing({ ...editing, [field.name]: event.target.value })}
                />
              ) : (
                <input
                  type={inputType}
                  required={field.required}
                  step={'step' in field ? field.step : undefined}
                  value={String(editing[field.name] ?? '')}
                  onChange={(event) => setEditing({ ...editing, [field.name]: event.target.value })}
                />
              )}
              {'hint' in field && field.hint && <p className="hint">{field.hint}</p>}
            </label>
          )
        })}
        <div className="form-actions">
          <button className="btn btn-gold" type="submit" disabled={pending || uploading}>
            {pending ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </form>
    )
  }

  return (
    <>
      <div className="admin-top">
        <div>
          <h1>{config.title}</h1>
          <p className="hint">{config.hint}</p>
        </div>
        <button className="btn btn-gold" type="button" onClick={() => { setError(null); setEditing(emptyForm(config.fields)) }}>
          Novo
        </button>
      </div>
      {error && <p className="alert">{error}</p>}
      <label className="field search">
        <span>Buscar</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      <div className="records">
        {visibleItems.length === 0 && <p className="empty">Nada por aqui ainda.</p>}
        {visibleItems.map((item) => (
          <article className="record" key={item.id}>
            <button className="linkish" type="button" onClick={() => { setError(null); setEditing(formFromItem(config.fields, item)) }}>
              <h2>{itemLabel(item)}{item.year ? ` · ${String(item.year)}` : ''}{item.edition_year ? ` · Edição ano de ${String(item.edition_year)}` : ''}{type === 'clients' && item.location ? ` · ${String(item.location)}` : ''}</h2>
              <span className={item.active === false ? 'badge off' : 'badge'}>{item.active === false ? 'Oculto' : 'No ar'}</span>
            </button>
            <button className="btn btn-danger" type="button" onClick={() => void remove(item)}>Excluir</button>
          </article>
        ))}
      </div>
    </>
  )
}
