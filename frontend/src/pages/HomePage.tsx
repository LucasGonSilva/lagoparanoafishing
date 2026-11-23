import { Link } from 'react-router-dom'
import { editionLabel, fishCountLabel, formatDay, formatMoney, lines, setting, upcomingEvents } from '../format'
import { Monogram, Prose, useSite } from '../site'

export function HomePage() {
  const { settings, rules, events, species, posts, products, clients, links, partners } = useSite()
  const short = setting(settings, 'short_name', 'L.P.F')
  const pillars = lines(setting(settings, 'pillars'))
  const about = setting(settings, 'about').split(/\n\n+/)[0] ?? ''
  const next = upcomingEvents(events)[0]
  const story = posts[0]

  return (
    <>
      <div className="wrap hero">
        <div className="hero-copy">
          <p className="eyebrow">
            {setting(settings, 'founded_date_label', '23 de novembro de 2022')} · {setting(settings, 'founded_time_label', '15:02')}
          </p>
          <h1>{short}</h1>
          <p className="hero-name">{setting(settings, 'group_name', 'Lago Paranoá Fishing')}</p>
          <p className="tagline">{setting(settings, 'tagline', 'Cem por cento pesca.')}</p>
          <p className="lede">{setting(settings, 'lede')}</p>
          <div className="hero-actions">
            <Link className="btn btn-gold" to="/participar">Quero participar</Link>
            <Link className="btn btn-ghost" to="/regras">As regras</Link>
          </div>
        </div>
        <div className="seal">
          <div className="seal-glow" aria-hidden="true" />
          <img src="/logo.png" alt="Emblema do L.P.F: barco no Lago Paranoá ao pôr do sol, com a ponte de três arcos. Desde 2022." />
        </div>
      </div>

      {pillars.length > 0 && (
        <div className="wrap">
          <ul className="pillars">
            {pillars.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      )}

      <section className="section">
        <div className="wrap founder">
          <div>
            <p className="section-index"><span>01</span> Quem abriu</p>
            <h2>{setting(settings, 'founder_nickname', 'Galegão da Pesca')}</h2>
            <p className="founder-name">{setting(settings, 'founder_name', 'Lucas Rafael Dutra Silva')}</p>
            <Prose value={about} />
            <div className="hero-actions">
              <Link className="btn btn-ghost" to="/grupo">A história do grupo</Link>
            </div>
          </div>
          <div className="clock">
            <p>{setting(settings, 'founded_date_label', '23 de novembro de 2022')}</p>
            <strong>{setting(settings, 'founded_time_label', '15:02')}</strong>
            <span>{setting(settings, 'city', 'Brasília — DF')} · {setting(settings, 'water', 'Lago Paranoá')}</span>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="section-index"><span>02</span> No lago</p>
              <h2>Quem mora nessa água</h2>
            </div>
            <Link to="/especies">Todas as espécies</Link>
          </div>
          <div className="species-list">
            {species.slice(0, 4).map((item) => (
              <Link key={item.id} to={`/especies/${item.slug}`}>
                <Monogram label={item.name} image={item.image_url} />
                <span>
                  <h3>{item.name}</h3>
                  <p>{item.summary}</p>
                </span>
                <span className="more">Ver</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap split">
          <div>
            <div className="section-head">
              <div>
                <p className="section-index"><span>03</span> Agenda</p>
                <h2>{next ? 'Próximo encontro' : 'O marco'}</h2>
              </div>
              <Link to="/eventos">Por ano</Link>
            </div>
            {next ? (
              <Link className="panel" to={`/eventos/${next.slug}`}>
                <span className={`badge ${next.status}`}>{next.status}</span>
                <h3 className="display" style={{ fontSize: '2.4rem', marginTop: '0.6rem' }}>{next.title}</h3>
                <p className="meta">{next.summary}</p>
              </Link>
            ) : (
              <div className="panel">
                <p className="meta">Nenhum encontro agendado. Quando a administração marcar, a data aparece aqui.</p>
                {events[0] && (
                  <p className="meta" style={{ marginTop: '0.8rem' }}>
                    <Link to={`/eventos/${events[0].slug}`}>
                      O marco do grupo: {setting(settings, 'founded_date_label')}, às {setting(settings, 'founded_time_label')}.
                    </Link>
                  </p>
                )}
              </div>
            )}
          </div>
          <div>
            <div className="section-head">
              <div>
                <p className="section-index"><span>04</span> Relato</p>
                <h2>Última nota</h2>
              </div>
              <Link to="/noticias">Notícias</Link>
            </div>
            {story ? (
              <Link className="panel" to={`/noticias/${story.slug}`}>
                <h3 className="display" style={{ fontSize: '2.4rem' }}>{story.title}</h3>
                <p className="meta">{story.excerpt}</p>
              </Link>
            ) : (
              <p className="panel meta">Nenhuma nota publicada.</p>
            )}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="section-index"><span>05</span> Combinado</p>
              <h2>A linha do grupo</h2>
            </div>
            <Link to="/regras">Ler as regras</Link>
          </div>
          <div className="rule-list">
            {rules.slice(0, 3).map((rule, index) => (
              <article key={rule.id}>
                <strong>{String(index + 1).padStart(2, '0')}</strong>
                <div>
                  <h3>{rule.title}</h3>
                  <p>{rule.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {products.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="section-head">
              <div>
                <p className="section-index"><span>06</span> Peças</p>
                <h2>Produtos do grupo</h2>
              </div>
              <Link to="/produtos">Ver produtos</Link>
            </div>
            <div className="species-list">
              {products.slice(0, 3).map((item) => (
                <Link key={item.id} to={`/produtos/${item.slug}`}>
                  <Monogram label={item.name} image={item.image_url} />
                  <span>
                    <h3>{item.name}</h3>
                    {editionLabel(item.edition_year) && <p className="sci">{editionLabel(item.edition_year)}</p>}
                    <p>{item.summary}</p>
                  </span>
                  <span className="more">{formatMoney(item.price)}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {clients.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="section-head">
              <div>
                <p className="section-index"><span>07</span> Embarcado</p>
                <h2>Clientes no barco</h2>
              </div>
              <Link to="/clientes">Ver pescarias</Link>
            </div>
            <div className="species-list">
              {clients.slice(0, 3).map((item) => (
                <Link key={item.id} to={`/clientes/${item.slug}`}>
                  <Monogram label={item.location} image={item.photos[0]?.url} />
                  <span>
                    <h3>{item.title}</h3>
                    <p>{item.location}{item.fished_on ? ` · ${formatDay(item.fished_on)}` : ''}</p>
                  </span>
                  <span className="more">{fishCountLabel(item.fish_count)}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {links.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="section-head">
              <div>
                <p className="section-index"><span>08</span> Para pescar</p>
                <h2>Links importantes</h2>
              </div>
              <Link to="/links">Ver links</Link>
            </div>
            <div className="link-list">
              {links.slice(0, 3).map((item) => (
                <article key={item.id}>
                  <h2>{item.title}</h2>
                  <p className="meta">{item.details}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {partners.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="section-head">
              <div>
                <p className="section-index"><span>09</span> Apoio</p>
                <h2>Parcerias</h2>
              </div>
              <Link to="/parcerias">Ver parcerias</Link>
            </div>
            <div className="species-list">
              {partners.slice(0, 3).map((item) => (
                <Link key={item.id} to={`/parcerias/${item.slug}`}>
                  <Monogram label={item.name} image={item.image_url} />
                  <span>
                    <h3>{item.name}</h3>
                    <p>{item.summary}</p>
                  </span>
                  <span className="more">Ver</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="wrap cta-band">
        <h2>{setting(settings, 'manifesto', 'O lago é o assunto.')}</h2>
        <Link className="btn btn-gold" to="/participar">Como participar</Link>
      </div>
    </>
  )
}
