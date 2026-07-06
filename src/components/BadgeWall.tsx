import type { Participant } from '../types'
import { EVENT } from '../config'
import { BADGE_DEFS, computeBadges } from '../lib/badges'

export function BadgeWall({ me }: { me?: Participant }) {
  const earned = new Set(
    me ? computeBadges({ laps: me.laps, lapKm: EVENT.lapKm }).map((b) => b.id) : [],
  )

  return (
    <div className="badge-grid">
      {BADGE_DEFS.map((b) => (
        <div key={b.id} className={`card badge-card${earned.has(b.id) ? '' : ' locked'}`}>
          <span className="emoji">{b.emoji}</span>
          <span>
            <b>{b.title}</b>
            <small>{b.description}</small>
          </span>
        </div>
      ))}
    </div>
  )
}
