import type { Participant, Tab } from '../types'
import { EVENT, EVENT_START } from '../config'
import { buildLeaderboard, formatKm } from '../lib/stats'
import { BADGE_DEFS, computeBadges } from '../lib/badges'
import { bestSplit, computeSplits, formatDuration, formatPace } from '../lib/splits'
import { shareCard } from '../lib/shareCard'
import { Avatar } from '../components/Avatar'
import { IconMedal, PrRays } from '../components/icons'
import { InstallButton } from '../components/InstallButton'

export function ProfileScreen({
  me,
  participants,
  demo,
  onNavigate,
}: {
  me?: Participant
  participants: Participant[]
  demo?: { has: boolean; load: () => void; clear: () => void }
  onNavigate: (tab: Tab) => void
}) {
  if (!me) {
    return (
      <div className="screen">
        <div className="screen-head">
          <div>
            <h1>Du</h1>
            <div className="sub">Dein Profil entsteht mit der Anmeldung.</div>
          </div>
        </div>
        <div className="card card-pad" style={{ textAlign: 'center' }}>
          <p className="muted" style={{ marginBottom: 14 }}>
            Melde dich an, um Runden zu tracken, Badges zu sammeln und im Leaderboard
            aufzutauchen.
          </p>
          <button className="btn btn-primary btn-block" onClick={() => onNavigate('track')}>
            Jetzt anmelden
          </button>
        </div>
        <DemoControls demo={demo} />
      </div>
    )
  }

  const laps = me.laps.length
  const splits = computeSplits(me.laps, EVENT_START, EVENT.lapKm)
  const best = bestSplit(splits)
  const rated = splits.filter((s) => s.paceSecPerKm !== null)
  const avgPace = rated.length
    ? rated.reduce((sum, s) => sum + s.paceSecPerKm!, 0) / rated.length
    : null
  const badges = computeBadges({ laps: me.laps, lapKm: EVENT.lapKm })
  const earned = new Set(badges.map((b) => b.id))
  const rank = buildLeaderboard(participants, EVENT.lapKm).find(
    (r) => r.participant.id === me.id,
  )?.rank

  return (
    <div className="screen">
      <div className="screen-head">
        <div>
          <h1>Du</h1>
        </div>
        <InstallButton />
      </div>

      <div className="card">
        <div className="profile-head">
          <Avatar name={me.name} />
          <div>
            <div className="p-name">{me.name}</div>
            {me.instagram && (
              <a
                className="p-insta"
                href={`https://instagram.com/${me.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                @{me.instagram}
              </a>
            )}
          </div>
        </div>
        <div className="stats-grid" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="cell">
            <div className="k">Distanz</div>
            <div className="v">{formatKm(laps * EVENT.lapKm)} km</div>
          </div>
          <div className="cell">
            <div className="k">Runden</div>
            <div className="v">{laps}</div>
          </div>
          <div className="cell">
            <div className="k">Ø Pace</div>
            <div className="v">{avgPace !== null ? formatPace(avgPace).replace(' /km', '') : '–'}</div>
          </div>
          <div className="cell">
            <div className="k">Platz</div>
            <div className="v">{rank !== undefined && laps > 0 ? `#${rank}` : '–'}</div>
          </div>
        </div>
      </div>

      {best && best.durationMs !== null && (
        <>
          <div className="section-label">Beste Runde</div>
          <div className="card pr-card">
            <PrRays />
            <div className="pr-medal">
              <IconMedal fill="#fff" label="PR" />
            </div>
            <div className="pr-time">{formatDuration(best.durationMs)}</div>
            <div className="pr-pace">
              {best.paceSecPerKm !== null ? formatPace(best.paceSecPerKm) : ''} · Runde #{best.n}
            </div>
          </div>
        </>
      )}

      <div className="section-label">Badges</div>
      <div className="badge-grid">
        {BADGE_DEFS.map((b) => (
          <div key={b.id} className={`badge-card${earned.has(b.id) ? '' : ' locked'}`}>
            <span className="emoji">{b.emoji}</span>
            <b>{b.title}</b>
            <small>{b.description}</small>
          </div>
        ))}
      </div>

      {laps > 0 && (
        <button
          className="btn btn-primary btn-block"
          style={{ marginTop: 18 }}
          onClick={() => shareCard(me, badges)}
        >
          ✨ Story-Bild für Instagram teilen
        </button>
      )}

      <DemoControls demo={demo} />
    </div>
  )
}

function DemoControls({ demo }: { demo?: { has: boolean; load: () => void; clear: () => void } }) {
  if (!demo) return null
  return (
    <p className="hint-note" style={{ marginTop: 20 }}>
      Demo-Modus: Daten bleiben auf diesem Gerät.{' '}
      {demo.has ? (
        <button className="btn-text" onClick={demo.clear}>
          Demo-Community entfernen
        </button>
      ) : (
        <button className="btn-text" onClick={demo.load}>
          Demo-Community laden
        </button>
      )}
    </p>
  )
}
