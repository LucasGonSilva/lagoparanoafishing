import { Link, useParams } from 'react-router-dom'
import { formatWhen } from '../format'
import { PageHero, Prose, useSite } from '../site'

export function NewsPage() {
  const { slug } = useParams()
  const { posts } = useSite()
  const post = posts.find((item) => item.slug === slug)

  if (!post) {
    return <PageHero kicker="Notícias" title="Nota não encontrada" />
  }

  return (
    <article>
      <header className="page-hero">
        <div className="wrap">
          <p className="crumb"><Link to="/noticias">Notícias</Link> / {post.title}</p>
          <p className="eyebrow">{formatWhen(post.published_at)}</p>
          <h1>{post.title}</h1>
          <p className="lede">{post.excerpt}</p>
        </div>
      </header>
      <div className="section" style={{ paddingTop: '1rem' }}>
        <div className="wrap stack">
          {post.image_url && <img className="story-cover" src={post.image_url} alt="" />}
          <Prose value={post.body} />
        </div>
      </div>
    </article>
  )
}
