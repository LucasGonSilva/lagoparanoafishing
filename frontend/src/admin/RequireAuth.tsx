import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { api, getToken } from '../api'

export function RequireAuth() {
  const [state, setState] = useState<'checking' | 'ok' | 'no'>('checking')

  useEffect(() => {
    if (!getToken()) {
      setState('no')
      return
    }
    let active = true
    api('/api/admin/me')
      .then(() => {
        if (active) {
          setState('ok')
        }
      })
      .catch(() => {
        if (active) {
          setState('no')
        }
      })
    return () => {
      active = false
    }
  }, [])

  if (state === 'checking') {
    return (
      <main className="boot">
        <p>Conferindo o acesso…</p>
      </main>
    )
  }

  if (state === 'no') {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
