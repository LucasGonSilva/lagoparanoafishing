import { Link, useParams } from 'react-router-dom'
import { availabilityLabel, editionLabel, formatMoney, safeUrl } from '../format'
import { Monogram, PageHero, Prose, useSite } from '../site'

export function ProductPage() {
  const { slug } = useParams()
  const { products } = useSite()
  const item = products.find((entry) => entry.slug === slug)
  const link = safeUrl(item?.link)

  if (!item) {
    return <PageHero kicker="Produtos" title="Produto não encontrado" />
  }

  return (
    <>
      <header className="page-hero">
        <div className="wrap">
          <p className="crumb"><Link to="/produtos">Produtos</Link> / {item.name}</p>
          <h1>{item.name}</h1>
          {item.category && <p className="sci">{item.category}</p>}
          {editionLabel(item.edition_year) && <p className="sci">{editionLabel(item.edition_year)}</p>}
          <p className="lede">{item.summary}</p>
        </div>
      </header>
      <article className="section" style={{ paddingTop: '1rem' }}>
        <div className="wrap detail">
          <div>
            <Monogram large label={item.name} image={item.image_url} />
            <div className="facts">
              {item.edition_year ? <div><span>Edição</span>{editionLabel(item.edition_year)}</div> : null}
              <div><span>Valor</span><strong className="price">{formatMoney(item.price)}</strong></div>
              <div><span>Situação</span>{availabilityLabel[item.availability]}</div>
            </div>
            {link ? (
              <a className="btn btn-gold" href={link} target="_blank" rel="noreferrer">Quero este</a>
            ) : (
              <p className="meta">O link de pedido ainda não foi publicado.</p>
            )}
          </div>
          <Prose value={item.body} />
        </div>
      </article>
    </>
  )
}
