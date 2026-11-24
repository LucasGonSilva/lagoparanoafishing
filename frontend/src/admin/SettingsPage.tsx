import { FormEvent, useEffect, useState } from 'react'
import { api } from '../api'
import type { Settings } from '../types'

const fields: { name: string; label: string; kind?: 'textarea' | 'number'; hint?: string }[] = [
  { name: 'group_name', label: 'Nome do grupo' },
  { name: 'short_name', label: 'Sigla' },
  { name: 'tagline', label: 'Chamada' },
  { name: 'lede', label: 'Texto de abertura', kind: 'textarea' },
  { name: 'seo_description', label: 'Descrição para buscadores', kind: 'textarea' },
  { name: 'founder_name', label: 'Nome de quem criou' },
  { name: 'founder_nickname', label: 'Como é conhecido' },
  { name: 'founded_date_label', label: 'Data em texto' },
  { name: 'founded_time_label', label: 'Hora em texto' },
  { name: 'city', label: 'Cidade' },
  { name: 'water', label: 'Água' },
  { name: 'about', label: 'História do grupo', kind: 'textarea' },
  { name: 'pillars', label: 'Linhas do grupo', kind: 'textarea', hint: 'Uma por linha.' },
  { name: 'manifesto', label: 'Frase de fechamento', kind: 'textarea' },
  { name: 'join_text', label: 'Texto de participação', kind: 'textarea' },
  { name: 'join_note', label: 'Aviso quando não houver link', kind: 'textarea' },
  { name: 'member_count', label: 'Integrantes no WhatsApp', kind: 'number', hint: 'Quantidade atual do grupo. Deixe em branco para não mostrar em O grupo.' },
  { name: 'whatsapp_url', label: 'Link do grupo', hint: 'Endereço completo, começando com https://' },
  { name: 'instagram_url', label: 'Instagram', hint: 'Endereço completo, começando com https://' },
  { name: 'contact_email', label: 'E-mail de contato' },
]

export function SettingsPage() {
  const [form, setForm] = useState<Settings>({})
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState(false)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    api<{ settings: Settings }>('/api/admin/settings')
      .then((result) => setForm(result.settings))
      .catch((reason: Error) => setError(reason.message))
  }, [])

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setPending(true)
    setError(null)
    setOk(false)
    const payload: Record<string, string | null> = {}
    for (const field of fields) {
      const value = form[field.name]
      payload[field.name] = value && value.trim() ? value : null
    }
    try {
      const result = await api<{ settings: Settings }>('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(payload),
      })
      setForm(result.settings)
      setOk(true)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível salvar.')
    } finally {
      setPending(false)
    }
  }

  return (
    <form className="stack" onSubmit={onSubmit}>
      <div className="admin-top">
        <div>
          <h1>Textos</h1>
          <p className="hint">Nome, história, fundador, quantidade de integrantes, frase do grupo e os links de contato.</p>
        </div>
        <button className="btn btn-gold" type="submit" disabled={pending}>{pending ? 'Salvando…' : 'Salvar'}</button>
      </div>
      {error && <p className="alert">{error}</p>}
      {ok && <p className="alert ok">Textos salvos. Atualize o site para ver.</p>}
      {fields.map((field) => (
        <label className="field" key={field.name}>
          <span>{field.label}</span>
          {field.kind === 'textarea' ? (
            <textarea
              value={form[field.name] ?? ''}
              onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}
            />
          ) : (
            <input
              type={field.kind === 'number' ? 'number' : 'text'}
              min={field.kind === 'number' ? 1 : undefined}
              step={field.kind === 'number' ? 1 : undefined}
              value={form[field.name] ?? ''}
              onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}
            />
          )}
          {field.hint && <p className="hint">{field.hint}</p>}
        </label>
      ))}
    </form>
  )
}
