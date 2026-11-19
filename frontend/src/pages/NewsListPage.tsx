import { Link } from 'react-router-dom'
import { formatWhen } from '../format'
import { PageHero, useSite } from '../site'

export function NewsListPage() {
  const { posts } = useSite()

  return (
    <>
      <PageHero kicker="Do grupo" title="Notícias" lede="Notas publicadas pela administração. Sem escalação, sem palanque." />
      <section className="section" style={{ paddingTop: '1rem' }}>
        <div className="wrap story-list">
          {posts.length === 0 && <p className="empty">Nenhuma nota publicada.</p>}
          {posts.map((post) => (
            <Link key={post.id} to={`/noticias/${post.slug}`}>
              <span className="meta">{formatWhen(post.published_at)}</span>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
