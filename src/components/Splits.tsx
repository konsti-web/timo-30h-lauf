import type { Participant } from '../types'
import { EVENT, EVENT_START } from '../config'
import { bestSplit, computeSplits, formatDuration, formatPace } from '../lib/splits'
import { formatTimeDE } from '../lib/time'

export function Splits({ me }: { me: Participant }) {
  if (me.laps.length === 0) return null

  const splits = computeSplits(me.laps, EVENT_START, EVENT.lapKm)
  const best = bestSplit(splits)
  const shown = splits.slice(-8).reverse()

  return (
    <div className="splits">
      <div className="splits-head">Deine Runden</div>
      {shown.map((s) => (
        <div key={s.n} className={`split-row${best && s.n === best.n ? ' best' : ''}`}>
          <span className="split-n">#{s.n}</span>
          <span className="split-time">{formatTimeDE(s.at)} Uhr</span>
          <span className="split-dur">
            {s.durationMs !== null ? formatDuration(s.durationMs) : '–'}
          </span>
          <span className="split-pace">
            {s.paceSecPerKm !== null ? formatPace(s.paceSecPerKm) : ''}
            {best && s.n === best.n ? ' ⚡️' : ''}
          </span>
        </div>
      ))}
      {splits.length > shown.length && (
        <div className="splits-more">… und {splits.length - shown.length} weitere</div>
      )}
    </div>
  )
}
