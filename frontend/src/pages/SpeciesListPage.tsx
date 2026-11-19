import { Link } from 'react-router-dom'
import { Monogram, PageHero, useSite } from '../site'

export function SpeciesListPage() {
  const { species } = useSite()

  return (
    <>
      <PageHero
        kicker="Lago Paranoá"
        title="Espécies"
        lede="Peixes que a pescaria do Paranoá conhece de perto. O texto é ponto de partida: a administração ajusta quando o lago ensina coisa nova."
      />
      <section className="section" style={{ paddingTop: '1rem' }}>
        <div className="wrap species-list">
          {species.length === 0 && <p className="empty">Nenhuma espécie publicada.</p>}
          {species.map((item) => (
            <Link key={item.id} to={`/especies/${item.slug}`}>
              <Monogram label={item.name} image={item.image_url} />
              <span>
                <h3>{item.name}</h3>
                {item.scientific_name && <p className="sci">{item.scientific_name}</p>}
                <p>{item.summary}</p>
              </span>
              <span className="more">Ficha</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
