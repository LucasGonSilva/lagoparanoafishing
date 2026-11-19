import { PageHero, useSite } from '../site'

export function RulesPage() {
  const { rules } = useSite()

  return (
    <>
      <PageHero
        kicker="Combinado"
        title="Regras"
        lede="O grupo é de pesca. O que está escrito aqui a administração pode ajustar no painel."
      />
      <section className="section" style={{ paddingTop: '1rem' }}>
        <div className="wrap rule-list">
          {rules.length === 0 && <p className="empty">Nenhuma regra publicada.</p>}
          {rules.map((rule, index) => (
            <article key={rule.id}>
              <strong>{String(index + 1).padStart(2, '0')}</strong>
              <div>
                <h3>{rule.title}</h3>
                <p>{rule.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
