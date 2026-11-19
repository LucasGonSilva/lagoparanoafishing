import type { FishingEvent, Settings } from './types'

export function setting(settings: Settings, key: string, fallback = ''): string {
  const value = settings?.[key]
  if (typeof value !== 'string') {
    return fallback
  }
  const trimmed = value.trim()
  return trimmed || fallback
}

export function lines(value: string): string[] {
  return value
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
}

export function paragraphs(value: string): string[] {
  return value
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter(Boolean)
}

export function formatWhen(value?: string | null, withTime = true): string {
  if (!value) {
    return 'Data a definir'
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return 'Data a definir'
  }
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  }).format(date)
}

export function formatDay(value?: string | null): string {
  if (!value) {
    return ''
  }
  const [year, month, day] = value.slice(0, 10).split('-').map(Number)
  if (!year || !month || !day) {
    return ''
  }
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month - 1, day))
}

export function toInputDateTime(value?: string | null): string {
  if (!value) {
    return ''
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return ''
  }
  const parts = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const pick = (type: string) => parts.find((part) => part.type === type)?.value ?? ''
  return `${pick('year')}-${pick('month')}-${pick('day')}T${pick('hour')}:${pick('minute')}`
}

export function upcomingEvents(events: FishingEvent[]): FishingEvent[] {
  const threshold = Date.now() - 60 * 60 * 1000
  return events
    .filter((event) => event.status === 'agendado' && event.starts_at && new Date(event.starts_at).getTime() >= threshold)
    .sort((a, b) => +new Date(a.starts_at ?? 0) - +new Date(b.starts_at ?? 0))
}

export function safeUrl(value?: string | null): string | null {
  if (!value) {
    return null
  }
  try {
    const url = new URL(value)
    if (url.protocol === 'https:' || url.protocol === 'http:') {
      return url.toString()
    }
  } catch {
    return null
  }
  return null
}

export const statusLabel: Record<FishingEvent['status'], string> = {
  agendado: 'Agendado',
  realizado: 'Realizado',
  cancelado: 'Cancelado',
}

export const availabilityLabel = {
  disponivel: 'Disponível',
  sob_encomenda: 'Sob encomenda',
  esgotado: 'Esgotado',
} as const

export function nameList(value?: string | null): string[] {
  if (!value) {
    return []
  }
  return value
    .split(/\n|,/)
    .map((name) => name.trim())
    .filter(Boolean)
}

export function fishCountLabel(count?: number | null): string {
  if (count === null || count === undefined) {
    return 'Não contado'
  }
  if (count === 1) {
    return '1 peixe'
  }
  return `${count} peixes`
}

export function videoEmbed(url: string): string | null {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return null
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return null
  }
  const host = parsed.hostname.replace(/^www\./, '')
  if (host === 'youtu.be') {
    const id = parsed.pathname.split('/').filter(Boolean)[0] ?? ''
    return /^[\w-]{6,}$/.test(id) ? `https://www.youtube.com/embed/${id}` : null
  }
  if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
    const parts = parsed.pathname.split('/').filter(Boolean)
    const id = parsed.searchParams.get('v') || ((parts[0] === 'embed' || parts[0] === 'shorts') ? parts[1] : '')
    return id && /^[\w-]{6,}$/.test(id) ? `https://www.youtube.com/embed/${id}` : null
  }
  if (host === 'vimeo.com') {
    const id = parsed.pathname.split('/').filter(Boolean)[0] ?? ''
    return /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null
  }
  if (host === 'player.vimeo.com') {
    const id = parsed.pathname.split('/').filter(Boolean)[1] ?? ''
    return /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null
  }
  return null
}

export function editionLabel(year?: number | null): string | null {
  if (!year) {
    return null
  }
  return `Edição ano de ${year}`
}

export function formatMoney(value?: string | number | null): string {
  if (value === null || value === undefined || value === '') {
    return 'Sob consulta'
  }
  const amount = Number(value)
  if (Number.isNaN(amount)) {
    return 'Sob consulta'
  }
  return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
