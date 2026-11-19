export type Settings = Record<string, string | null>

export type Rule = {
  id: number
  title: string
  body: string
  position: number
  active: boolean
}

export type FishingEvent = {
  id: number
  title: string
  slug: string
  location: string | null
  summary: string | null
  body: string | null
  starts_at: string | null
  ends_at: string | null
  status: 'agendado' | 'realizado' | 'cancelado'
  year: number
  image_path: string | null
  image_url: string | null
  active: boolean
}

export type Species = {
  id: number
  name: string
  slug: string
  scientific_name: string | null
  summary: string
  body: string
  bait: string | null
  period: string | null
  image_path: string | null
  image_url: string | null
  position: number
  active: boolean
}

export type Post = {
  id: number
  title: string
  slug: string
  excerpt: string
  body: string
  image_path: string | null
  image_url: string | null
  published_at: string | null
  active: boolean
}

export type GalleryItem = {
  id: number
  title: string
  caption: string | null
  image_path: string | null
  image_url: string | null
  taken_on: string | null
  position: number
  active: boolean
}

export type Product = {
  id: number
  name: string
  slug: string
  category: string | null
  edition_year: number | null
  summary: string
  body: string
  price: string | null
  availability: 'disponivel' | 'sob_encomenda' | 'esgotado'
  link: string | null
  image_path: string | null
  image_url: string | null
  position: number
  active: boolean
}

export type TripPhoto = {
  path: string
  url: string | null
}

export type TripVideo =
  | { kind: 'file'; path: string; url: string | null }
  | { kind: 'link'; url: string }

export type ClientTrip = {
  id: number
  title: string
  slug: string
  location: string
  fished_on: string | null
  fish_count: number | null
  anglers: string
  guide: string
  notes: string | null
  photos: TripPhoto[]
  videos: TripVideo[]
  position: number
  active: boolean
}

export type Faq = {
  id: number
  question: string
  answer: string
  position: number
  active: boolean
}

export type SiteData = {
  settings: Settings
  rules: Rule[]
  events: FishingEvent[]
  products: Product[]
  species: Species[]
  posts: Post[]
  gallery: GalleryItem[]
  clients: ClientTrip[]
  faqs: Faq[]
}

export type AdminUser = {
  id: number
  name: string
  email: string
}
