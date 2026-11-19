import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'

const cards = [
  ['rules', 'Regras', '/admin/regras'],
  ['events', 'Eventos', '/admin/eventos'],
  ['products', 'Produtos', '/admin/produtos'],
  ['clients', 'Clientes', '/admin/clientes'],
  ['species', 'Espécies', '/admin/especies'],
  ['posts', 'Notícias', '/admin/noticias'],
  ['gallery', 'Fotos', '/admin/galeria'],
  ['faqs', 'Perguntas', '/admin/perguntas'],
]

export function DashboardPage() {
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api<{ counts: Record<string, number> }>('/api/admin/stats')
      .then((result) => setCounts(result.counts))
      .catch((reason: Error) => setError(reason.message))
  }, [])

  return (
    <>
      <div className="admin-top">
        <div>
          <p className="eyebrow">L.P.F</p>
          <h1>Painel</h1>
        </div>
        <Link className="btn btn-ghost" to="/admin/textos">Editar textos</Link>
      </div>
      <p className="hint" style={{ maxWidth: '40rem', marginBottom: '1.4rem' }}>
        Tudo que está no ar sai daqui: textos, regras, eventos por ano, produtos, pescarias de clientes, espécies, fotos, notícias e perguntas. A senha inicial se troca em Acesso.
      </p>
      {error && <p className="alert">{error}</p>}
      <div className="stats">
        {cards.map(([key, label, to]) => (
          <Link key={key} to={to}>
            <strong>{counts[key] ?? '—'}</strong>
            {label}
          </Link>
        ))}
      </div>
    </>
  )
}
