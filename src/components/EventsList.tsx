import { UPCOMING_EVENTS } from '../config'

export function EventsList() {
  return (
    <div className="event-list">
      {UPCOMING_EVENTS.map((ev) => {
        const d = new Date(ev.date)
        return (
          <div key={ev.id} className={`card event-card${ev.highlight ? ' highlight' : ''}`}>
            <div className="event-date">
              <div className="d">{d.getDate()}</div>
              <div className="m">
                {d.toLocaleDateString('de-DE', { month: 'short' }).replace('.', '')}
              </div>
            </div>
            <div>
              <h3>{ev.title}</h3>
              <p>{ev.description}</p>
              <div className="loc">
                📍 {ev.location} ·{' '}
                {d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
