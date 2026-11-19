import { Link } from 'react-router-dom'
import { availabilityLabel, editionLabel, formatMoney } from '../format'
import { Monogram, PageHero, useSite } from '../site'

export function ProductsPage() {
  const { products } = useSite()

  return (
    <>
      <PageHero
        kicker="L.P.F"
        title="Produtos"
        lede="As peças do grupo. Preço, estoque e o jeito de pedir são publicados pela administração."
      />
      <section className="section" style={{ paddingTop: '1rem' }}>
        <div className="wrap species-list">
          {products.length === 0 && <p className="empty">Nenhum produto publicado.</p>}
          {products.map((item) => (
            <Link key={item.id} to={`/produtos/${item.slug}`}>
              <Monogram label={item.name} image={item.image_url} />
              <span>
                <h3>{item.name}</h3>
                {item.category && <p className="sci">{item.category}</p>}
                {editionLabel(item.edition_year) && <p className="sci">{editionLabel(item.edition_year)}</p>}
                <p>{item.summary}</p>
              </span>
              <span className="more">
                {formatMoney(item.price)}
                <br />
                {availabilityLabel[item.availability]}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
