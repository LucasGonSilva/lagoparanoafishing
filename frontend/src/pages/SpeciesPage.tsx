import { Link, useParams } from 'react-router-dom'
import { Monogram, PageHero, Prose, useSite } from '../site'

export function SpeciesPage() {
  const { slug } = useParams()
  const { species } = useSite()
  const item = species.find((entry) => entry.slug === slug)

  if (!item) {
    return <PageHero kicker="Espécies" title="Ficha não encontrada" />
  }

  return (
    <>
      <header className="page-hero">
        <div className="wrap">
          <p className="crumb"><Link to="/especies">Espécies</Link> / {item.name}</p>
          <h1>{item.name}</h1>
          {item.scientific_name && <p className="sci">{item.scientific_name}</p>}
          <p className="lede">{item.summary}</p>
        </div>
      </header>
      <article className="section" style={{ paddingTop: '1rem' }}>
        <div className="wrap detail">
          <div>
            <Monogram large label={item.name} image={item.image_url} />
            <div className="facts">
              {item.period && <div><span>Horário que a galera tenta</span>{item.period}</div>}
              {item.bait && <div><span>Isca de partida</span>{item.bait}</div>}
            </div>
          </div>
          <Prose value={item.body} />
        </div>
      </article>
    </>
  )
}
