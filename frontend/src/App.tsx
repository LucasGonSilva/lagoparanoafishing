import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { AdminLayout } from './admin/AdminLayout'
import { DashboardPage } from './admin/DashboardPage'
import { LoginPage } from './admin/LoginPage'
import { ProfilePage } from './admin/ProfilePage'
import { RequireAuth } from './admin/RequireAuth'
import { ResourcePage } from './admin/ResourcePage'
import { SettingsPage } from './admin/SettingsPage'
import { ClientPage } from './pages/ClientPage'
import { ClientsPage } from './pages/ClientsPage'
import { EventPage } from './pages/EventPage'
import { EventsPage } from './pages/EventsPage'
import { GalleryPage } from './pages/GalleryPage'
import { GroupPage } from './pages/GroupPage'
import { HomePage } from './pages/HomePage'
import { JoinPage } from './pages/JoinPage'
import { LinksPage } from './pages/LinksPage'
import { PartnerPage } from './pages/PartnerPage'
import { PartnersPage } from './pages/PartnersPage'
import { NewsListPage } from './pages/NewsListPage'
import { NewsPage } from './pages/NewsPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProductPage } from './pages/ProductPage'
import { ProductsPage } from './pages/ProductsPage'
import { RulesPage } from './pages/RulesPage'
import { SpeciesListPage } from './pages/SpeciesListPage'
import { SpeciesPage } from './pages/SpeciesPage'
import { SiteLayout } from './site'

function LegacyEventRedirect() {
  const { slug } = useParams()
  return <Navigate to={slug ? `/eventos/${slug}` : '/eventos'} replace />
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="grupo" element={<GroupPage />} />
          <Route path="regras" element={<RulesPage />} />
          <Route path="eventos" element={<EventsPage />} />
          <Route path="eventos/:slug" element={<EventPage />} />
          <Route path="encontros" element={<Navigate to="/eventos" replace />} />
          <Route path="encontros/:slug" element={<LegacyEventRedirect />} />
          <Route path="produtos" element={<ProductsPage />} />
          <Route path="produtos/:slug" element={<ProductPage />} />
          <Route path="clientes" element={<ClientsPage />} />
          <Route path="clientes/:slug" element={<ClientPage />} />
          <Route path="especies" element={<SpeciesListPage />} />
          <Route path="especies/:slug" element={<SpeciesPage />} />
          <Route path="galeria" element={<GalleryPage />} />
          <Route path="noticias" element={<NewsListPage />} />
          <Route path="noticias/:slug" element={<NewsPage />} />
          <Route path="links" element={<LinksPage />} />
          <Route path="parcerias" element={<PartnersPage />} />
          <Route path="parcerias/:slug" element={<PartnerPage />} />
          <Route path="participar" element={<JoinPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="admin/login" element={<LoginPage />} />
        <Route path="admin" element={<RequireAuth />}>
          <Route element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="textos" element={<SettingsPage />} />
            <Route path="regras" element={<ResourcePage type="rules" />} />
            <Route path="eventos" element={<ResourcePage type="events" />} />
            <Route path="produtos" element={<ResourcePage type="products" />} />
            <Route path="clientes" element={<ResourcePage type="clients" />} />
            <Route path="especies" element={<ResourcePage type="species" />} />
            <Route path="galeria" element={<ResourcePage type="gallery" />} />
            <Route path="noticias" element={<ResourcePage type="posts" />} />
            <Route path="links" element={<ResourcePage type="links" />} />
            <Route path="parcerias" element={<ResourcePage type="partners" />} />
            <Route path="pessoas" element={<ResourcePage type="people" />} />
            <Route path="perguntas" element={<ResourcePage type="faqs" />} />
            <Route path="acesso" element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
