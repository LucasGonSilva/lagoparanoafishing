import { Link } from 'react-router-dom'
import { PageHero } from '../site'

export function NotFoundPage() {
  return (
    <>
      <PageHero kicker="404" title="Essa margem não existe" lede="O endereço não está no site do L.P.F." />
      <div className="wrap" style={{ paddingBottom: '4rem' }}>
        <Link className="btn btn-gold" to="/">Voltar ao início</Link>
      </div>
    </>
  )
}
