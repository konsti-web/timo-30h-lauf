import { useState } from 'react'
import type { EventPhase, Participant } from '../types'
import { EVENT } from '../config'
import { buildLeaderboard, formatKm, type LeaderboardRow } from '../lib/stats'
import { Avatar } from '../components/Avatar'
import { IconMedal } from '../components/icons'

const COLLAPSED_COUNT = 12
const MEDAL_COLORS = ['#f0b429', '#9ca3af', '#b46a3c']

function Podium({ rows }: { rows: LeaderboardRow[] }) {
  const [first, second, third] = rows
  const order: { row?: LeaderboardRow; cls: string; idx: number }[] = [
    { row: second, cls: 'second', idx: 1 },
    { row: first, cls: 'first', idx: 0 },
    { row: third, cls: 'third', idx: 2 },
  ]
  return (
    <div className="podium">
      {order.map(({ row, cls, idx }) =>
        row ? (
          <div key={row.participant.id} className={`spot ${cls}`}>
            <Avatar name={row.participant.name} />
            <div className="medal" aria-hidden="true">
              <span style={{ display: 'inline-block', width: 22, height: 22 }}>
                <IconMedal fill={MEDAL_COLORS[idx]} label={String(idx + 1)} />
              </span>
            </div>
            <div className="name">{row.participant.name}</div>
            <div className="laps">
              {row.laps} {row.laps === 1 ? 'Runde' : 'Runden'}
            </div>
          </div>
        ) : (
          <div key={cls} className={`spot ${cls}`} />
        ),
      )}
    </div>
  )
}

export function BoardScreen({
  participants,
  meId,
  phase,
}: {
  participants: Participant[]
  meId?: string
  phase: EventPhase
}) {
  const [expanded, setExpanded] = useState(false)
  const rows = buildLeaderboard(participants, EVENT.lapKm)
  const hasLaps = rows.some((r) => r.laps > 0)

  const rest = hasLaps ? rows.slice(3) : rows
  let shown = rest
  if (!expanded && rest.length > COLLAPSED_COUNT + 2) {
    shown = rest.slice(0, COLLAPSED_COUNT)
    const meRow = rest.find((r) => r.participant.id === meId)
    if (meRow && !shown.includes(meRow)) shown = [...shown, meRow]
  }

  return (
    <div className="screen">
      <div className="screen-head">
        <div>
          <h1>Leaderboard</h1>
          <div className="sub">
            {phase === 'after'
              ? 'Das Endergebnis – ihr wart großartig!'
              : phase === 'live'
                ? 'Aktualisiert sich live'
                : `${rows.length} ${rows.length === 1 ? 'Person ist' : 'Leute sind'} angemeldet`}
          </div>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="card">
          <div className="board-empty">Noch niemand angemeldet – sei die erste Person auf dem Board! 🚀</div>
        </div>
      ) : (
        <>
          {hasLaps && (
            <div className="card">
              <Podium rows={rows} />
            </div>
          )}
          <div className="card">
            {shown.map((r) => (
              <div
                key={r.participant.id}
                className={`board-row${r.participant.id === meId ? ' me' : ''}`}
              >
                <span className="rank">{r.rank}.</span>
                <Avatar name={r.participant.name} />
                <span className="names">
                  <span className="name">
                    {r.participant.name}
                    {r.participant.id === meId ? ' (du)' : ''}
                  </span>
                  {r.participant.instagram && (
                    <a
                      className="insta"
                      href={`https://instagram.com/${r.participant.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      @{r.participant.instagram}
                    </a>
                  )}
                </span>
                <span className="laps-cell">
                  {r.laps} {r.laps === 1 ? 'Runde' : 'Runden'}
                  <small>{formatKm(r.km)} km</small>
                </span>
              </div>
            ))}
            {rest.length > COLLAPSED_COUNT + 2 && (
              <button className="board-toggle" onClick={() => setExpanded(!expanded)}>
                {expanded ? 'Weniger anzeigen' : `Alle ${rows.length} anzeigen`}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
