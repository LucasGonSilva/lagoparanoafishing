import { lines, setting } from '../format'
import { PageHero, Prose, useSite } from '../site'
import type { GroupPerson } from '../types'

function byRole(people: GroupPerson[]) {
  const groups: { role: string; people: GroupPerson[] }[] = []
  for (const person of people) {
    const key = person.role.trim().toLocaleLowerCase('pt-BR')
    const current = groups.find((group) => group.role.trim().toLocaleLowerCase('pt-BR') === key)
    if (current) {
      current.people.push(person)
      continue
    }
    groups.push({ role: person.role, people: [person] })
  }
  return groups
}

export function GroupPage() {
  const { settings, people } = useSite()
  const pillars = lines(setting(settings, 'pillars'))
  const crew = byRole(people ?? [])

  return (
    <>
      <PageHero
        kicker={setting(settings, 'water', 'Lago Paranoá')}
        title="O grupo"
        lede={setting(settings, 'lede')}
      />
      <section className="section" style={{ paddingTop: '1.5rem' }}>
        <div className="wrap founder">
          <Prose value={setting(settings, 'about')} />
          <div className="clock">
            <p>{setting(settings, 'founder_name')}</p>
            <strong>{setting(settings, 'founded_time_label', '15:02')}</strong>
            <span>{setting(settings, 'founder_nickname')} · {setting(settings, 'founded_date_label')}</span>
          </div>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap crew">
          <div>
            <p className="section-index"><span>02</span> Quem cuida</p>
            <h2>No grupo</h2>
          </div>
          {crew.length === 0 && (
            <p className="empty">A administração ainda não publicou quem cuida e quem colabora.</p>
          )}
          {crew.map((group) => (
            <div className="crew-role" key={group.role}>
              <h3>{group.role}</h3>
              <div className="crew-list">
                {group.people.map((person) => (
                  <article key={person.id}>
                    <strong>{person.name}</strong>
                    {person.nickname && <span>{person.nickname}</span>}
                    {person.note && <p>{person.note}</p>}
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      {pillars.length > 0 && (
        <div className="wrap" style={{ paddingBottom: '4rem' }}>
          <p className="section-index"><span>03</span> A linha</p>
          <ul className="pillars">
            {pillars.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <p className="lede">{setting(settings, 'manifesto')}</p>
        </div>
      )}
    </>
  )
}
