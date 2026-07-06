import { useEffect, useRef, useState } from 'react'
import type { EventPhase, Participant } from '../types'
import { EVENT } from '../config'
import { formatKm } from '../lib/stats'
import { computeBadges } from '../lib/badges'
import { fireConfetti } from '../lib/confetti'
import { shareCard } from '../lib/shareCard'
import { Splits } from './Splits'

export function LapTracker({
  me,
  phase,
  onAddLap,
  onUndo,
}: {
  me: Participant
  phase: EventPhase
  onAddLap: () => Promise<void>
  onUndo: () => Promise<void>
}) {
  const [busy, setBusy] = useState(false)
  const laps = me.laps.length
  const km = laps * EVENT.lapKm
  const badges = computeBadges({ laps: me.laps, lapKm: EVENT.lapKm })

  // Konfetti bei neuem Badge oder erreichtem Rundenziel
  const prevBadges = useRef(badges.length)
  const prevLaps = useRef(laps)
  useEffect(() => {
    const newBadge = badges.length > prevBadges.current
    const goalHit = me.goalLaps !== undefined && laps === me.goalLaps && prevLaps.current < laps
    if (newBadge || goalHit) fireConfetti()
    prevBadges.current = badges.length
    prevLaps.current = laps
  }, [badges.length, laps, me.goalLaps])

  async function run(action: () => Promise<void>) {
    setBusy(true)
    try {
      await action()
      if ('vibrate' in navigator) navigator.vibrate?.(30)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="card tracker fade-in">
      <p className="greeting">
        Hey <b>{me.name}</b>
        {phase === 'before' && ' – du bist angemeldet! Der Tracker öffnet zum Startschuss.'}
        {phase === 'live' && ' – stark, dass du dabei bist!'}
        {phase === 'after' && ' – was für ein Lauf. Danke, dass du dabei warst!'}
      </p>
      <div className="lap-count">{laps}</div>
      <div className="lap-word">{laps === 1 ? 'Runde' : 'Runden'}</div>

      <div className="tracker-stats">
        <div className="stat">
          <div className="v">{formatKm(km)} km</div>
          <div className="k">Distanz</div>
        </div>
        {badges.length > 0 && (
          <div className="stat">
            <div className="v">{badges.map((b) => b.emoji).join(' ')}</div>
            <div className="k">Badges</div>
          </div>
        )}
        {me.goalLaps ? (
          <div className="stat">
            <div className="v">
              {Math.min(100, Math.round((laps / me.goalLaps) * 100))} %
            </div>
            <div className="k">vom Ziel</div>
          </div>
        ) : null}
      </div>

      {phase === 'live' && (
        <>
          <button
            className="btn btn-primary big-lap-btn"
            disabled={busy}
            onClick={() => run(onAddLap)}
          >
            + Runde eintragen
          </button>
          {laps > 0 && (
            <div className="undo-row">
              <button disabled={busy} onClick={() => run(onUndo)}>
                Ups, eine zu viel – letzte Runde zurücknehmen
              </button>
            </div>
          )}
        </>
      )}

      {laps > 0 && (
        <div className="share-row">
          <button className="btn btn-ghost" onClick={() => shareCard(me, badges)}>
            ✨ Story-Bild teilen
          </button>
        </div>
      )}

      {me.goalLaps ? (
        <div className="goal-bar">
          <div className="bar">
            <div
              className="fill"
              style={{ width: `${Math.min(100, (laps / me.goalLaps) * 100)}%` }}
            />
          </div>
          <div className="caption">
            {laps >= me.goalLaps
              ? `🎉 Ziel erreicht – ${laps} von ${me.goalLaps} Runden!`
              : `Noch ${me.goalLaps - laps} ${me.goalLaps - laps === 1 ? 'Runde' : 'Runden'} bis zu deinem Ziel von ${me.goalLaps}`}
          </div>
        </div>
      ) : null}

      <Splits me={me} />
    </div>
  )
}
