import { useEffect, useState } from 'react'
import { EVENT_START, EVENT_END } from '../config'
import { computeCountdown, eventProgress, formatElapsed } from '../lib/time'

export function LiveBanner() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const remaining = computeCountdown(now, EVENT_END)
  const progress = eventProgress(now, EVENT_START, EVENT_END)

  return (
    <div className="card live-banner fade-in">
      <div className="stat">
        <div className="v">{formatElapsed(now, EVENT_START, EVENT_END)}</div>
        <div className="k">Läuft seit</div>
      </div>
      <div className="bar" aria-hidden="true">
        <div className="fill" style={{ width: `${progress * 100}%` }} />
      </div>
      <div className="stat">
        <div className="v">
          {String(remaining.days * 24 + remaining.hours).padStart(2, '0')}:
          {String(remaining.minutes).padStart(2, '0')}:
          {String(remaining.seconds).padStart(2, '0')}
        </div>
        <div className="k">Verbleibend</div>
      </div>
    </div>
  )
}
