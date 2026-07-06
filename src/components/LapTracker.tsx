import { useState } from 'react'
import type { EventPhase, Participant } from '../types'
import { EVENT } from '../config'
import { formatKm } from '../lib/stats'

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
    </div>
  )
}
