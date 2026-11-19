import { lines, setting } from '../format'
import { PageHero, Prose, useSite } from '../site'

export function GroupPage() {
  const { settings } = useSite()
  const pillars = lines(setting(settings, 'pillars'))

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
      {pillars.length > 0 && (
        <div className="wrap" style={{ paddingBottom: '4rem' }}>
          <p className="section-index"><span>02</span> A linha</p>
          <ul className="pillars">
            {pillars.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <p className="lede">{setting(settings, 'manifesto')}</p>
        </div>
      )}
    </>
  )
}
