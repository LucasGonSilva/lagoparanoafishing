import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { formatWhen, statusLabel } from '../format'
import { PageHero, Prose, useSite } from '../site'

export function EventPage() {
  const { slug } = useParams()
  const { events } = useSite()
  const event = events.find((item) => item.slug === slug)
  const [photo, setPhoto] = useState<string | null>(null)

  useEffect(() => {
    if (!photo) {
      return
    }
    const onKey = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key === 'Escape') {
        setPhoto(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [photo])

  if (!event) {
    return (
      <PageHero kicker="Eventos" title="Evento não encontrado" lede="Esse registro não está publicado." />
    )
  }

  const shots = [
    ...(event.image_url ? [event.image_url] : []),
    ...(event.photos ?? []).flatMap((item) => (item.url && item.url !== event.image_url ? [item.url] : [])),
  ]

  return (
    <>
      <header className="page-hero">
        <div className="wrap">
          <p className="crumb"><Link to={`/eventos?ano=${event.year}`}>Eventos {event.year}</Link> / {event.title}</p>
          <p className="eyebrow">{formatWhen(event.starts_at)}</p>
          <h1>{event.title}</h1>
          <p className="lede">{event.summary}</p>
        </div>
      </header>
      <article className="section" style={{ paddingTop: '1rem' }}>
        <div className="wrap detail">
          <div>
            {shots.length > 0 && (
              <div className="event-photos">
                {shots.map((url) => (
                  <button key={url} className="zoom" type="button" aria-label="Ampliar foto" onClick={() => setPhoto(url)}>
                    <img src={url} alt={event.title} />
                  </button>
                ))}
              </div>
            )}
            <div className="facts">
              <div><span>Ano</span>{event.year}</div>
              <div><span>Situação</span>{statusLabel[event.status]}</div>
              {event.location && <div><span>Local</span>{event.location}</div>}
              {event.ends_at && <div><span>Até</span>{formatWhen(event.ends_at)}</div>}
            </div>
          </div>
          <Prose value={event.body ?? ''} />
        </div>
      </article>
      {photo && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={event.title} onClick={() => setPhoto(null)}>
          <figure onClick={(click) => click.stopPropagation()}>
            <img src={photo} alt={event.title} />
            <figcaption>
              <strong>{event.title}</strong>
              <button className="btn btn-ghost" type="button" onClick={() => setPhoto(null)}>Fechar</button>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  )
}
