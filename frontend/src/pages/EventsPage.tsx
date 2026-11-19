import { Link, useSearchParams } from 'react-router-dom'
import { formatWhen, statusLabel } from '../format'
import { PageHero, useSite } from '../site'

export function EventsPage() {
  const { events } = useSite()
  const [params, setParams] = useSearchParams()
  const years = [...new Set(events.map((event) => event.year))].filter((year) => year > 0).sort((a, b) => b - a)
  const requested = Number(params.get('ano'))
  const year = years.includes(requested) ? requested : years[0]
  const shown = events
    .filter((event) => event.year === year)
    .sort((a, b) => +new Date(b.starts_at ?? 0) - +new Date(a.starts_at ?? 0))

  return (
    <>
      <PageHero
        kicker="Cadastro"
        title="Eventos"
        lede="O calendário do grupo, ano a ano. A administração cadastra o que foi marcado e o que já aconteceu."
      />
      <section className="section" style={{ paddingTop: '1rem' }}>
        <div className="wrap">
          {years.length === 0 && <p className="empty">Nenhum evento cadastrado. O primeiro ano aparece aqui quando a administração publicar.</p>}
          {years.length > 0 && (
            <div className="year-switch" role="tablist" aria-label="Ano dos eventos">
              {years.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={item === year ? 'is-on' : undefined}
                  aria-pressed={item === year}
                  onClick={() => setParams({ ano: String(item) })}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
          {year && <h2 style={{ fontSize: '2.6rem', marginBottom: '0.4rem' }}>{year}</h2>}
          {year && shown.length === 0 && <p className="empty">Nenhum evento cadastrado em {year}.</p>}
          <div className="timeline">
            {shown.map((event) => (
              <Link key={event.id} to={`/eventos/${event.slug}`}>
                <span className={`badge ${event.status}`}>{statusLabel[event.status]}</span>
                <h3>{event.title}</h3>
                <p>{formatWhen(event.starts_at)}{event.location ? ` · ${event.location}` : ''}</p>
                <p>{event.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
