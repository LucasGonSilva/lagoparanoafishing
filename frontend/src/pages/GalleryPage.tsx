import { useEffect, useState } from 'react'
import { formatDay } from '../format'
import { PageHero, useSite } from '../site'
import type { GalleryItem } from '../types'

export function GalleryPage() {
  const { gallery } = useSite()
  const [active, setActive] = useState<GalleryItem | null>(null)

  useEffect(() => {
    if (!active) {
      return
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActive(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])

  return (
    <>
      <PageHero kicker="Margem" title="Galeria" lede="Fotos publicadas pela administração. O que não está aqui ainda não subiu." />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          {gallery.length === 0 && (
            <p className="empty">A margem ainda está quieta. As fotos entram por aqui quando a administração publicar.</p>
          )}
          <div className="gallery-grid">
            {gallery.map((item) => (
              <button key={item.id} type="button" onClick={() => setActive(item)}>
                <figure>
                  {item.image_url && <img src={item.image_url} alt={item.title} />}
                  <figcaption>
                    <strong>{item.title}</strong>
                    {item.taken_on && <small> · {formatDay(item.taken_on)}</small>}
                  </figcaption>
                </figure>
              </button>
            ))}
          </div>
        </div>
      </section>
      {active && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={active.title} onClick={() => setActive(null)}>
          <figure onClick={(event) => event.stopPropagation()}>
            {active.image_url && <img src={active.image_url} alt={active.title} />}
            <figcaption>
              <div>
                <strong>{active.title}</strong>
                {active.caption && <p className="meta">{active.caption}</p>}
              </div>
              <button className="btn btn-ghost" type="button" onClick={() => setActive(null)}>Fechar</button>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  )
}
