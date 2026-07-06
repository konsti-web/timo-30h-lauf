import type { Participant } from '../types'
import { EVENT } from '../config'
import { computeTotals, formatKm } from '../lib/stats'

export function CommunityGoal({ participants }: { participants: Participant[] }) {
  const totals = computeTotals(participants, EVENT.lapKm)
  const pct = Math.min(100, Math.round((totals.km / EVENT.communityGoalKm) * 100))

  const R = 74
  const C = 2 * Math.PI * R

  return (
    <div className="card community fade-in">
      <div className="ring-wrap">
        <svg width="172" height="172" viewBox="0 0 172 172" aria-hidden="true">
          <circle cx="86" cy="86" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="13" />
          <circle
            cx="86"
            cy="86"
            r={R}
            fill="none"
            stroke="url(#goalGrad)"
            strokeWidth="13"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - pct / 100)}
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)' }}
          />
          <defs>
            <linearGradient id="goalGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff5a1f" />
              <stop offset="100%" stopColor="#ffb46b" />
            </linearGradient>
          </defs>
        </svg>
        <div className="ring-center">
          <div>
            <div className="pct">{pct} %</div>
            <div className="lbl">vom Ziel</div>
          </div>
        </div>
      </div>
      <div>
        <h2 className="section-title">
          Gemeinsam {EVENT.communityGoalKm.toLocaleString('de-DE')} km
        </h2>
        <p className="section-sub" style={{ marginBottom: 0 }}>
          Alle Runden aller Läufer:innen zählen zusammen. Jede einzelne bringt uns näher
          ans große Ziel.
        </p>
        <div className="community-stats">
          <div className="stat">
            <div className="v">{formatKm(totals.km)}</div>
            <div className="k">km gesamt</div>
          </div>
          <div className="stat">
            <div className="v">{totals.laps}</div>
            <div className="k">Runden</div>
          </div>
          <div className="stat">
            <div className="v">{totals.participants}</div>
            <div className="k">Läufer:innen</div>
          </div>
        </div>
      </div>
    </div>
  )
}
