import { safeUrl } from '../format'
import { PageHero, Prose, useSite } from '../site'

export function LinksPage() {
  const { links } = useSite()

  return (
    <>
      <PageHero
        kicker="Para pescar"
        title="Links"
        lede="Endereços e informações que a administração publica para quem pesca. Carteirinha, documento e o que mais ajudar entra aqui."
      />
      <section className="section" style={{ paddingTop: '1rem' }}>
        <div className="wrap link-list">
          {links.length === 0 && (
            <p className="empty">Nenhum link publicado. Quando a administração cadastrar um endereço útil, ele aparece aqui.</p>
          )}
          {links.map((item) => {
            const url = safeUrl(item.url)
            return (
              <article key={item.id}>
                <h2>{item.title}</h2>
                <Prose value={item.details ?? ''} />
                {url && <a className="btn btn-gold" href={url} target="_blank" rel="noreferrer">Abrir</a>}
              </article>
            )
          })}
        </div>
      </section>
    </>
  )
}
