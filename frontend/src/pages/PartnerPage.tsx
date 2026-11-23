import { Link, useParams } from 'react-router-dom'
import { safeUrl } from '../format'
import { Monogram, PageHero, Prose, useSite } from '../site'

export function PartnerPage() {
  const { slug } = useParams()
  const { partners } = useSite()
  const item = partners.find((entry) => entry.slug === slug)
  const url = safeUrl(item?.url)

  if (!item) {
    return <PageHero kicker="Parcerias" title="Parceria não encontrada" lede="Esse registro não está publicado." />
  }

  return (
    <>
      <header className="page-hero">
        <div className="wrap">
          <p className="crumb"><Link to="/parcerias">Parcerias</Link> / {item.name}</p>
          <h1>{item.name}</h1>
          <p className="lede">{item.summary}</p>
        </div>
      </header>
      <article className="section" style={{ paddingTop: '1rem' }}>
        <div className="wrap detail">
          <div>
            <Monogram large label={item.name} image={item.image_url} />
            {url ? (
              <a className="btn btn-gold" href={url} target="_blank" rel="noreferrer">Site da parceria</a>
            ) : (
              <p className="meta">O site ainda não foi publicado.</p>
            )}
          </div>
          <Prose value={item.body ?? ''} />
        </div>
      </article>
    </>
  )
}
