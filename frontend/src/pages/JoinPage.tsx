import { safeUrl, setting } from '../format'
import { PageHero, Prose, useSite } from '../site'

export function JoinPage() {
  const { settings, faqs } = useSite()
  const whatsapp = safeUrl(settings.whatsapp_url)
  const instagram = safeUrl(settings.instagram_url)
  const email = settings.contact_email

  return (
    <>
      <PageHero kicker="Entrada" title="Participar" lede={setting(settings, 'tagline')} />
      <section className="section" style={{ paddingTop: '1rem' }}>
        <div className="wrap split">
          <div className="stack">
            <Prose value={setting(settings, 'join_text')} />
            {whatsapp ? (
              <a className="btn btn-gold" href={whatsapp} target="_blank" rel="noreferrer">Entrar no grupo</a>
            ) : (
              <p className="empty">{setting(settings, 'join_note', 'O link de entrada ainda não foi publicado.')}</p>
            )}
            <div className="facts">
              {instagram && <div><span>Instagram</span><a href={instagram} target="_blank" rel="noreferrer">{instagram}</a></div>}
              {email && <div><span>E-mail</span><a href={`mailto:${email}`}>{email}</a></div>}
            </div>
          </div>
          <div className="faq">
            <h2 style={{ fontSize: '2.8rem', marginBottom: '0.6rem' }}>Perguntas</h2>
            {faqs.map((faq) => (
              <details key={faq.id}>
                <summary>{faq.question}</summary>
                <p className="meta">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
