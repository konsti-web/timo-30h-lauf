import { useEffect, useState } from 'react'
import { computeCountdown } from '../lib/time'
import { EVENT_START } from '../config'

const CELLS: { key: 'days' | 'hours' | 'minutes' | 'seconds'; label: string }[] = [
  { key: 'days', label: 'Tage' },
  { key: 'hours', label: 'Stunden' },
  { key: 'minutes', label: 'Minuten' },
  { key: 'seconds', label: 'Sekunden' },
]

export function Countdown() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const c = computeCountdown(now, EVENT_START)

  return (
    <div className="countdown" role="timer" aria-label="Countdown bis zum Start">
      {CELLS.map(({ key, label }) => (
        <div key={key} className={`count-cell ${key}`}>
          <div className="num">{String(c[key]).padStart(2, '0')}</div>
          <div className="label">{label}</div>
        </div>
      ))}
    </div>
  )
}
