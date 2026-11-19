import { Link, useParams } from 'react-router-dom'
import { formatWhen, statusLabel } from '../format'
import { PageHero, Prose, useSite } from '../site'

export function EventPage() {
  const { slug } = useParams()
  const { events } = useSite()
  const event = events.find((item) => item.slug === slug)

  if (!event) {
    return (
      <PageHero kicker="Eventos" title="Evento não encontrado" lede="Esse registro não está publicado." />
    )
  }

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
            {event.image_url && <img src={event.image_url} alt="" />}
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
    </>
  )
}
