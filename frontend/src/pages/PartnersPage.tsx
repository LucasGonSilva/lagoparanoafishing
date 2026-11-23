import { Link } from 'react-router-dom'
import { Monogram, PageHero, useSite } from '../site'

export function PartnersPage() {
  const { partners } = useSite()

  return (
    <>
      <PageHero
        kicker="Apoio"
        title="Parcerias"
        lede="Quem caminha com o L.P.F. Cada ficha sai da administração, com o nome, o texto e o site."
      />
      <section className="section" style={{ paddingTop: '1rem' }}>
        <div className="wrap species-list">
          {partners.length === 0 && (
            <p className="empty">Nenhuma parceria publicada. Quando um apoio for cadastrado, ele aparece aqui.</p>
          )}
          {partners.map((item) => (
            <Link key={item.id} to={`/parcerias/${item.slug}`}>
              <Monogram label={item.name} image={item.image_url} />
              <span>
                <h3>{item.name}</h3>
                <p>{item.summary}</p>
              </span>
              <span className="more">Ver</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
