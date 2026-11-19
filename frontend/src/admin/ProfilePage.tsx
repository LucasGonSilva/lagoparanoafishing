import { FormEvent, useEffect, useState } from 'react'
import { api } from '../api'
import type { AdminUser } from '../types'

export function ProfilePage() {
  const [me, setMe] = useState<AdminUser | null>(null)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newConfirmation, setNewConfirmation] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function load() {
    const [profile, list] = await Promise.all([
      api<{ user: AdminUser }>('/api/admin/me'),
      api<{ data: AdminUser[] }>('/api/admin/users'),
    ])
    setMe(profile.user)
    setName(profile.user.name)
    setEmail(profile.user.email)
    setUsers(list.data)
  }

  useEffect(() => {
    load().catch((reason: Error) => setError(reason.message))
  }, [])

  async function saveProfile(event: FormEvent) {
    event.preventDefault()
    setPending(true)
    setError(null)
    setOk(null)
    try {
      const result = await api<{ user: AdminUser }>('/api/admin/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name,
          email,
          current_password: currentPassword || null,
          password: password || null,
          password_confirmation: confirmation || null,
        }),
      })
      setMe(result.user)
      setPassword('')
      setConfirmation('')
      setCurrentPassword('')
      setOk('Acesso atualizado.')
      await load()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível salvar.')
    } finally {
      setPending(false)
    }
  }

  async function createUser(event: FormEvent) {
    event.preventDefault()
    setPending(true)
    setError(null)
    setOk(null)
    try {
      await api('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          password: newPassword,
          password_confirmation: newConfirmation,
        }),
      })
      setNewName('')
      setNewEmail('')
      setNewPassword('')
      setNewConfirmation('')
      setOk('Novo acesso criado.')
      await load()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível criar o acesso.')
    } finally {
      setPending(false)
    }
  }

  async function remove(user: AdminUser) {
    if (!window.confirm(`Remover o acesso de ${user.name}?`)) {
      return
    }
    setError(null)
    try {
      await api(`/api/admin/users/${user.id}`, { method: 'DELETE' })
      await load()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível remover.')
    }
  }

  return (
    <div className="stack">
      <div className="admin-top">
        <div>
          <h1>Acesso</h1>
          <p className="hint">Quem entra no painel. Troque a senha inicial aqui.</p>
        </div>
      </div>
      {error && <p className="alert">{error}</p>}
      {ok && <p className="alert ok">{ok}</p>}
      <form className="stack" onSubmit={saveProfile}>
        <h2 style={{ fontSize: '2.2rem' }}>Seu acesso</h2>
        <label className="field">
          <span>Nome</span>
          <input value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
        <label className="field">
          <span>E-mail</span>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label className="field">
          <span>Senha atual</span>
          <input type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
          <p className="hint">Obrigatória para mudar o e-mail ou a senha.</p>
        </label>
        <label className="field">
          <span>Nova senha</span>
          <input type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <label className="field">
          <span>Confirmar nova senha</span>
          <input type="password" autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} />
        </label>
        <button className="btn btn-gold" type="submit" disabled={pending}>Salvar acesso</button>
      </form>
      <form className="stack" onSubmit={createUser}>
        <h2 style={{ fontSize: '2.2rem' }}>Outro acesso</h2>
        <label className="field">
          <span>Nome</span>
          <input value={newName} onChange={(event) => setNewName(event.target.value)} required />
        </label>
        <label className="field">
          <span>E-mail</span>
          <input type="email" value={newEmail} onChange={(event) => setNewEmail(event.target.value)} required />
        </label>
        <label className="field">
          <span>Senha</span>
          <input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required />
        </label>
        <label className="field">
          <span>Confirmar senha</span>
          <input type="password" value={newConfirmation} onChange={(event) => setNewConfirmation(event.target.value)} required />
        </label>
        <button className="btn btn-ghost" type="submit" disabled={pending}>Criar acesso</button>
      </form>
      <div className="records">
        {users.map((user) => (
          <article className="record" key={user.id}>
            <div>
              <h2>{user.name}</h2>
              <p className="meta">{user.email}{me?.id === user.id ? ' · você' : ''}</p>
            </div>
            {me?.id !== user.id && (
              <button className="btn btn-danger" type="button" onClick={() => void remove(user)}>Remover</button>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}
