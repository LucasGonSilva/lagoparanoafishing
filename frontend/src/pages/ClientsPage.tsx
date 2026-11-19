import { Link } from 'react-router-dom'
import { fishCountLabel, formatDay } from '../format'
import { Monogram, PageHero, useSite } from '../site'

export function ClientsPage() {
  const { clients } = useSite()

  return (
    <>
      <PageHero
        kicker="Embarcado"
        title="Clientes"
        lede="Pescarias embarcadas em que o Galegão da Pesca vai de guia. Cada ficha traz o local, quem pescou, a quantidade de peixes, as fotos e os vídeos."
      />
      <section className="section" style={{ paddingTop: '1rem' }}>
        <div className="wrap species-list">
          {clients.length === 0 && (
            <p className="empty">Nenhuma pescaria de cliente publicada. Quando uma saída for registrada, ela aparece aqui.</p>
          )}
          {clients.map((item) => (
            <Link key={item.id} to={`/clientes/${item.slug}`}>
              <Monogram label={item.location} image={item.photos[0]?.url} />
              <span>
                <h3>{item.title}</h3>
                <p className="sci">{item.location}{item.fished_on ? ` · ${formatDay(item.fished_on)}` : ''}</p>
                <p>{item.guide}</p>
              </span>
              <span className="more">{fishCountLabel(item.fish_count)}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
