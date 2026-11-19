import { useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { api, clearToken } from '../api'

const links = [
  ['/admin', 'Painel'],
  ['/admin/textos', 'Textos'],
  ['/admin/regras', 'Regras'],
  ['/admin/eventos', 'Eventos'],
  ['/admin/produtos', 'Produtos'],
  ['/admin/clientes', 'Clientes'],
  ['/admin/especies', 'Espécies'],
  ['/admin/galeria', 'Galeria'],
  ['/admin/noticias', 'Notícias'],
  ['/admin/perguntas', 'Perguntas'],
  ['/admin/acesso', 'Acesso'],
]

export function AdminLayout() {
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Painel — L.P.F'
  }, [])

  async function logout() {
    try {
      await api('/api/admin/logout', { method: 'POST' })
    } finally {
      clearToken()
      navigate('/admin/login')
    }
  }

  return (
    <div className="admin">
      <aside className="admin-side">
        <a className="side-brand" href="/">
          <img src="/logo.png" alt="" />
          <strong>L.P.F</strong>
        </a>
        {links.map(([to, label]) => (
          <NavLink key={to} to={to} end={to === '/admin'} className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
            {label}
          </NavLink>
        ))}
        <a href="/">Ver o site</a>
        <button className="linkish" type="button" onClick={logout}>Sair</button>
      </aside>
      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  )
}
