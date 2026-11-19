import { createContext, useContext, useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { api } from './api'
import { paragraphs, safeUrl, setting } from './format'
import type { SiteData } from './types'

const SiteContext = createContext<SiteData | null>(null)

export function useSite(): SiteData {
  const value = useContext(SiteContext)
  if (!value) {
    throw new Error('O site ainda não foi carregado.')
  }
  return value
}

export function Prose({ value }: { value: string }) {
  const blocks = paragraphs(value)
  if (!blocks.length) {
    return null
  }
  return (
    <div className="prose">
      {blocks.map((block, index) => (
        <p key={index}>{block}</p>
      ))}
    </div>
  )
}

const links = [
  ['/', 'Início'],
  ['/grupo', 'O grupo'],
  ['/regras', 'Regras'],
  ['/eventos', 'Eventos'],
  ['/produtos', 'Produtos'],
  ['/clientes', 'Clientes'],
  ['/especies', 'Espécies'],
  ['/galeria', 'Galeria'],
  ['/noticias', 'Notícias'],
  ['/participar', 'Participar'],
]

export function SiteLayout() {
  const [data, setData] = useState<SiteData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    let active = true
    api<SiteData>('/api/site')
      .then((payload) => {
        if (active) {
          setData(payload)
        }
      })
      .catch((reason: Error) => {
        if (active) {
          setError(reason.message)
        }
      })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    setOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    if (!data) {
      return
    }
    const short = setting(data.settings, 'short_name', 'L.P.F')
    const group = setting(data.settings, 'group_name', 'Lago Paranoá Fishing')
    document.title = `${short} — ${group}`
    document.querySelector('meta[name="description"]')?.setAttribute('content', setting(data.settings, 'seo_description'))
  }, [data, location.pathname])

  if (error) {
    return (
      <main className="boot-error">
        <img src="/logo.png" alt="" width={120} height={120} />
        <h1>O lago não respondeu</h1>
        <p>{error}</p>
        <button className="btn btn-gold" type="button" onClick={() => window.location.reload()}>
          Tentar de novo
        </button>
      </main>
    )
  }

  if (!data) {
    return (
      <main className="boot">
        <img src="/logo.png" alt="" />
        <p>Abrindo o lago…</p>
      </main>
    )
  }

  const short = setting(data.settings, 'short_name', 'L.P.F')
  const group = setting(data.settings, 'group_name', 'Lago Paranoá Fishing')
  const city = setting(data.settings, 'city', 'Brasília — DF')
  const water = setting(data.settings, 'water', 'Lago Paranoá')
  const whatsapp = safeUrl(data.settings.whatsapp_url)
  const instagram = safeUrl(data.settings.instagram_url)
  const email = data.settings.contact_email

  return (
    <SiteContext.Provider value={data}>
      <a className="skip" href="#conteudo">Ir para o conteúdo</a>
      <div className="topbar">
        <div className="wrap">
          <span>{city} · {water}</span>
          <span>Grupo de pesca desde 2022</span>
        </div>
      </div>
      <header className={open ? 'site-header is-open' : 'site-header'}>
        <div className="wrap">
          <Link className="brand" to="/">
            <span className="brand-mark"><img src="/logo.png" alt="" /></span>
            <span>
              <strong>{short}</strong>
              <small>{group}</small>
            </span>
          </Link>
          <button className="nav-toggle" type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
            {open ? 'Fechar' : 'Menu'}
          </button>
          <nav className="nav-links" aria-label="Principal">
            {links.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main id="conteudo">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="wrap footer-grid">
          <div>
            <strong>{short}</strong>
            <p>{group}</p>
            <p className="fine">
              Criado por {setting(data.settings, 'founder_name', 'Lucas Rafael Dutra Silva')}, o {setting(data.settings, 'founder_nickname', 'Galegão da Pesca')}, em {setting(data.settings, 'founded_date_label', '23 de novembro de 2022')}, às {setting(data.settings, 'founded_time_label', '15:02')}.
            </p>
          </div>
          <div>
            <p>No site</p>
            <ul>
              {links.slice(1).map(([to, label]) => (
                <li key={to}><Link to={to}>{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p>Contato</p>
            <ul>
              {whatsapp && <li><a href={whatsapp} target="_blank" rel="noreferrer">Entrar no grupo</a></li>}
              {instagram && <li><a href={instagram} target="_blank" rel="noreferrer">Instagram</a></li>}
              {email && <li><a href={`mailto:${email}`}>{email}</a></li>}
              {!whatsapp && !instagram && !email && <li>Os canais saem no painel quando a administração publicar.</li>}
              <li><Link to="/admin">Painel</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </SiteContext.Provider>
  )
}

export function PageHero({ kicker, title, lede }: { kicker: string; title: string; lede?: string }) {
  return (
    <header className="page-hero">
      <div className="wrap">
        <p className="eyebrow">{kicker}</p>
        <h1>{title}</h1>
        {lede && <p className="lede">{lede}</p>}
      </div>
    </header>
  )
}

export function Monogram({ label, image, large = false }: { label: string; image?: string | null; large?: boolean }) {
  if (image) {
    return <img className={large ? 'mono-lg' : 'mono'} src={image} alt="" />
  }
  return <span className={large ? 'mono-lg' : 'mono'} aria-hidden="true">{label.slice(0, 1)}</span>
}
