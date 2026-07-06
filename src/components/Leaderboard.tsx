import type { Participant } from '../types'
import { EVENT } from '../config'
import { buildLeaderboard, formatKm } from '../lib/stats'
import { computeBadges } from '../lib/badges'

const AVATAR_HUES = [14, 32, 158, 205, 260, 288, 340]

function avatarStyle(name: string) {
  let h = 0
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 997
  const hue = AVATAR_HUES[h % AVATAR_HUES.length]
  return { background: `linear-gradient(135deg, hsl(${hue} 70% 48%), hsl(${hue + 25} 70% 38%))` }
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const MEDALS = ['🥇', '🥈', '🥉']

export function Leaderboard({ participants, meId }: { participants: Participant[]; meId?: string }) {
  const rows = buildLeaderboard(participants, EVENT.lapKm)

  if (rows.length === 0) {
    return (
      <div className="card board">
        <div className="board-empty">
          Noch niemand angemeldet – sei die erste Person auf dem Board! 🚀
        </div>
      </div>
    )
  }

  return (
    <div className="card board">
      {rows.map((r) => {
        const badges = computeBadges({ laps: r.participant.laps, lapKm: EVENT.lapKm })
        return (
          <div
            key={r.participant.id}
            className={`board-row${r.participant.id === meId ? ' me' : ''}`}
          >
            <span className={`rank${r.rank <= 3 ? ' top' : ''}`}>
              {r.rank <= 3 && r.laps > 0 ? MEDALS[r.rank - 1] : `${r.rank}.`}
            </span>
            <span className="who">
              <span className="avatar" style={avatarStyle(r.participant.name)}>
                {initials(r.participant.name)}
              </span>
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
            </span>
            <span className="badges-cell" title={badges.map((b) => b.title).join(', ')}>
              {badges.map((b) => b.emoji).join(' ')}
            </span>
            <span className="laps-cell">
              {r.laps} {r.laps === 1 ? 'Runde' : 'Runden'}
              <small>{formatKm(r.km)} km</small>
            </span>
          </div>
        )
      })}
    </div>
  )
}
