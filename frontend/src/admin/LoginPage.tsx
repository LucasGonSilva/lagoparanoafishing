import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, setToken } from '../api'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setPending(true)
    setError(null)
    try {
      const result = await api<{ token: string }>('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      setToken(result.token)
      navigate('/admin')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível entrar.')
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="login">
      <form onSubmit={onSubmit}>
        <img src="/logo.png" alt="" />
        <h1>Painel</h1>
        <p className="hint" style={{ textAlign: 'center' }}>Administração do Lago Paranoá Fishing.</p>
        {error && <p className="alert">{error}</p>}
        <label className="field">
          <span>E-mail</span>
          <input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label className="field">
          <span>Senha</span>
          <input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>
        <button className="btn btn-gold" type="submit" disabled={pending}>{pending ? 'Entrando…' : 'Entrar'}</button>
        <Link to="/">Voltar ao site</Link>
      </form>
    </main>
  )
}
