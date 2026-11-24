import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { formatWhen, safeUrl, statusLabel } from '../format'
import { PageHero, Prose, useSite } from '../site'
import { linkKinds, supportKinds, type EventSponsor } from '../types'

function SponsorCard({ sponsor, onPhoto }: { sponsor: EventSponsor; onPhoto: (photo: { url: string; caption: string }) => void }) {
  const href = safeUrl(sponsor.url)
  const linkLabel = linkKinds.find((item) => item.value === sponsor.url_kind)?.label ?? 'Site'
  return (
    <article>
      {sponsor.image_url && (
        <button className="zoom" type="button" aria-label={`Ampliar foto de ${sponsor.name}`} onClick={() => onPhoto({ url: sponsor.image_url as string, caption: sponsor.name })}>
          <img src={sponsor.image_url} alt={sponsor.name} />
        </button>
      )}
      <strong>{sponsor.name}</strong>
      {sponsor.note && <p>{sponsor.note}</p>}
      {href && <a href={href} target="_blank" rel="noreferrer">{linkLabel}</a>}
    </article>
  )
}

export function EventPage() {
  const { slug } = useParams()
  const { events } = useSite()
  const event = events.find((item) => item.slug === slug)
  const [photo, setPhoto] = useState<{ url: string; caption: string } | null>(null)

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
  const sponsors = event.sponsors ?? []

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
      <article className="section event-sheet" style={{ paddingTop: '1rem' }}>
        <div className="wrap detail">
          <div className="facts">
            <div><span>Ano</span>{event.year}</div>
            <div><span>Situação</span>{statusLabel[event.status]}</div>
            {event.location && <div><span>Local</span>{event.location}</div>}
            {event.ends_at && <div><span>Até</span>{formatWhen(event.ends_at)}</div>}
          </div>
          <Prose value={event.body ?? ''} />
        </div>
        {shots.length > 0 && (
          <div className="wrap event-photos">
            {shots.map((url) => (
              <button key={url} className="zoom" type="button" aria-label="Ampliar foto" onClick={() => setPhoto({ url, caption: event.title })}>
                <img src={url} alt={event.title} />
              </button>
            ))}
          </div>
        )}
        {sponsors.length > 0 && (
          <div className="wrap event-support">
            <p className="section-index"><span>Apoio</span></p>
            {supportKinds.flatMap((group) => {
              const people = sponsors.filter((sponsor) => (sponsor.kind || 'patrocinadores') === group.value)
              if (people.length === 0) {
                return []
              }
              return [(
                <section className="event-support-group" key={group.value}>
                  <h3>{group.label}</h3>
                  <div className="event-sponsors">
                    {people.map((sponsor, index) => (
                      <SponsorCard key={`${group.value}-${sponsor.name}-${index}`} sponsor={sponsor} onPhoto={setPhoto} />
                    ))}
                  </div>
                </section>
              )]
            })}
          </div>
        )}
      </article>
      {photo && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={photo.caption} onClick={() => setPhoto(null)}>
          <figure onClick={(click) => click.stopPropagation()}>
            <img src={photo.url} alt={photo.caption} />
            <figcaption>
              <strong>{photo.caption}</strong>
              <button className="btn btn-ghost" type="button" onClick={() => setPhoto(null)}>Fechar</button>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  )
}
