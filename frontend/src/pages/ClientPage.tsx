import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fishCountLabel, formatDay, nameList, safeUrl, videoEmbed } from '../format'
import { PageHero, Prose, useSite } from '../site'
import type { TripPhoto } from '../types'

export function ClientPage() {
  const { slug } = useParams()
  const { clients } = useSite()
  const item = clients.find((entry) => entry.slug === slug)
  const [photo, setPhoto] = useState<TripPhoto | null>(null)
  const anglers = nameList(item?.anglers)

  useEffect(() => {
    if (!photo) {
      return
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPhoto(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [photo])

  if (!item) {
    return <PageHero kicker="Clientes" title="Pescaria não encontrada" lede="Esse registro não está publicado." />
  }

  return (
    <>
      <header className="page-hero">
        <div className="wrap">
          <p className="crumb"><Link to="/clientes">Clientes</Link> / {item.title}</p>
          <h1>{item.title}</h1>
          <p className="sci">{item.location}</p>
          {item.fished_on && <p className="lede">{formatDay(item.fished_on)}</p>}
        </div>
      </header>
      <article className="section" style={{ paddingTop: '1rem' }}>
        <div className="wrap">
          <div className="facts trip-facts">
            <div><span>Local</span>{item.location}</div>
            <div><span>Data</span>{item.fished_on ? formatDay(item.fished_on) : 'Data a definir'}</div>
            <div><span>Peixes</span>{fishCountLabel(item.fish_count)}</div>
            <div><span>Guia</span>{item.guide}</div>
          </div>

          {anglers.length > 0 && (
            <section className="trip-block">
              <h2>Quem pescou</h2>
              <ul className="angler-list">
                {anglers.map((name, index) => <li key={`${name}-${index}`}>{name}</li>)}
              </ul>
            </section>
          )}

          {item.notes && (
            <section className="trip-block">
              <h2>Relato</h2>
              <Prose value={item.notes} />
            </section>
          )}

          {item.photos.length > 0 && (
            <section className="trip-block">
              <h2>Fotos</h2>
              <div className="trip-photos">
                {item.photos.map((entry) => (
                  <button key={entry.path} type="button" onClick={() => setPhoto(entry)}>
                    {entry.url && <img src={entry.url} alt="" />}
                  </button>
                ))}
              </div>
            </section>
          )}

          {item.videos.length > 0 && (
            <section className="trip-block">
              <h2>Vídeos</h2>
              <div className="trip-videos">
                {item.videos.map((entry) => {
                  const source = entry.url ?? ''
                  const embed = entry.kind === 'link' ? videoEmbed(source) : null
                  const key = entry.kind === 'file' ? entry.path : source
                  if (entry.kind === 'file' && source) {
                    return <video key={key} src={source} controls playsInline />
                  }
                  if (embed) {
                    return (
                      <iframe
                        key={key}
                        src={embed}
                        title={`Vídeo de ${item.title}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )
                  }
                  const href = safeUrl(source)
                  return href ? (
                    <p key={key}><a href={href} target="_blank" rel="noreferrer">Assistir vídeo</a></p>
                  ) : null
                })}
              </div>
            </section>
          )}
        </div>
      </article>
      {photo?.url && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={item.title} onClick={() => setPhoto(null)}>
          <figure onClick={(event) => event.stopPropagation()}>
            <img src={photo.url} alt="" />
            <figcaption>
              <strong>{item.title}</strong>
              <button className="btn btn-ghost" type="button" onClick={() => setPhoto(null)}>Fechar</button>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  )
}
