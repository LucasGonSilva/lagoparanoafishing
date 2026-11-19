const tokenKey = 'lpf_token'

export function getToken(): string | null {
  return localStorage.getItem(tokenKey)
}

export function setToken(token: string): void {
  localStorage.setItem(tokenKey, token)
}

export function clearToken(): void {
  localStorage.removeItem(tokenKey)
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')

  const token = getToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(path, { ...options, headers })

  if (response.status === 401 && path.startsWith('/api/admin')) {
    clearToken()
    if (!window.location.pathname.startsWith('/admin/login')) {
      window.location.assign('/admin/login')
    }
  }

  if (!response.ok) {
    let message = 'Não foi possível concluir agora.'
    try {
      const data = await response.json()
      if (data?.errors) {
        const messages = Object.values(data.errors).flat()
        if (messages.length) {
          message = messages.join(' ')
        }
      } else if (typeof data?.message === 'string' && data.message !== 'The given data was invalid.') {
        message = data.message
      }
    } catch {
      // resposta sem JSON
    }
    throw new ApiError(message, response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}
