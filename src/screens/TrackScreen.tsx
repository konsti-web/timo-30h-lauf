import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { EventPhase, Participant } from '../types'
import { EVENT, EVENT_START } from '../config'
import type { RegisterInput } from '../store'
import { formatKm } from '../lib/stats'
import { computeBadges } from '../lib/badges'
import { bestSplit, computeSplits, formatDuration, formatPace } from '../lib/splits'
import { formatDateDE, formatTimeDE } from '../lib/time'
import { fireConfetti } from '../lib/confetti'
import { shareCard } from '../lib/shareCard'
import { IconMedal } from '../components/icons'

function RegisterForm({ onRegister }: { onRegister: (i: RegisterInput) => Promise<void> }) {
  const [name, setName] = useState('')
  const [instagram, setInstagram] = useState('')
  const [goal, setGoal] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (name.trim().length < 2) {
      setError('Bitte gib deinen Namen ein (mind. 2 Zeichen).')
      return
    }
    const goalLaps = goal ? Number(goal) : undefined
    if (goalLaps !== undefined && (!Number.isInteger(goalLaps) || goalLaps < 1 || goalLaps > 500)) {
      setError('Das Rundenziel muss zwischen 1 und 500 liegen.')
      return
    }
    setError('')
    setBusy(true)
    try {
      await onRegister({ name, instagram: instagram || undefined, goalLaps })
    } catch {
      setError('Anmeldung fehlgeschlagen – bitte nochmal versuchen.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <div className="screen-head">
        <div>
          <h1>Sei dabei 🏃</h1>
          <div className="sub">Kein Account, kein Passwort – nur dein Name.</div>
        </div>
      </div>
      <form className="card card-pad" onSubmit={submit}>
        <div className="field">
          <label htmlFor="reg-name">Dein Name *</label>
          <input
            id="reg-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="z. B. Lena M."
            maxLength={60}
            autoComplete="name"
          />
        </div>
        <div className="field">
          <label htmlFor="reg-insta">Instagram (optional)</label>
          <div className="prefix-wrap">
            <span>@</span>
            <input
              id="reg-insta"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value.replace(/^@/, ''))}
              placeholder="dein.handle"
              maxLength={40}
              autoCapitalize="none"
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="reg-goal">Dein Rundenziel (optional)</label>
          <input
            id="reg-goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value.replace(/\D/g, ''))}
            placeholder="z. B. 5"
            inputMode="numeric"
            maxLength={3}
          />
        </div>
        {error && <p className="form-error">{error}</p>}
        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? 'Einen Moment …' : 'Anmelden'}
        </button>
      </form>
      <p className="hint-note">
        Dein Instagram-Handle wird im Leaderboard verlinkt, wenn du magst.
      </p>
    </>
  )
}

function SplitsList({ me }: { me: Participant }) {
  const splits = computeSplits(me.laps, EVENT_START, EVENT.lapKm)
  const best = bestSplit(splits)
  const shown = splits.slice(-10).reverse()

  if (!splits.length) return null

  return (
    <>
      <div className="section-label">Deine Runden</div>
      <div className="card">
        {shown.map((s) => {
          const isBest = best !== null && s.n === best.n
          return (
            <div key={s.n} className={`split-row${isBest ? ' best' : ''}`}>
              <span className="medal-ico" aria-hidden="true">
                {isBest ? <IconMedal fill="#f0b429" label="PR" /> : <IconMedal fill="#e7e5e4" />}
              </span>
              <span className="split-n">#{s.n}</span>
              <span className="split-time">{formatTimeDE(s.at)} Uhr</span>
              <span className="split-dur">{s.durationMs !== null ? formatDuration(s.durationMs) : '–'}</span>
              <span className="split-pace">{s.paceSecPerKm !== null ? formatPace(s.paceSecPerKm) : ''}</span>
            </div>
          )
        })}
        {splits.length > shown.length && (
          <div className="board-empty" style={{ padding: '10px' }}>
            … und {splits.length - shown.length} weitere
          </div>
        )}
      </div>
    </>
  )
}

export function TrackScreen({
  me,
  phase,
  onRegister,
  onAddLap,
  onUndo,
}: {
  me?: Participant
  phase: EventPhase
  onRegister: (i: RegisterInput) => Promise<void>
  onAddLap: () => Promise<void>
  onUndo: () => Promise<void>
}) {
  const [busy, setBusy] = useState(false)
  const laps = me?.laps.length ?? 0
  const badges = me ? computeBadges({ laps: me.laps, lapKm: EVENT.lapKm }) : []

  // Konfetti bei neuem Badge oder erreichtem Rundenziel
  const prevBadges = useRef(badges.length)
  const prevLaps = useRef(laps)
  useEffect(() => {
    const newBadge = badges.length > prevBadges.current
    const goalHit = me?.goalLaps !== undefined && laps === me.goalLaps && prevLaps.current < laps
    if (newBadge || goalHit) fireConfetti()
    prevBadges.current = badges.length
    prevLaps.current = laps
  }, [badges.length, laps, me?.goalLaps])

  if (!me) {
    return (
      <div className="screen">
        <RegisterForm onRegister={onRegister} />
      </div>
    )
  }

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
    <div className="screen">
      <div className="screen-head">
        <div>
          <h1>Deine Runden</h1>
          <div className="sub">
            {phase === 'before' && `Der Tracker öffnet zum Start am ${formatDateDE(EVENT.startISO)}.`}
            {phase === 'live' && 'Nach jeder Runde einmal tippen – fertig.'}
            {phase === 'after' && 'Was für ein Lauf. Danke, dass du dabei warst!'}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="track-hero">
          <div className="greeting">
            Hey <b>{me.name}</b> 👋
          </div>
          <div className="lap-count">{laps}</div>
          <div className="lap-word">{laps === 1 ? 'Runde' : 'Runden'} · {formatKm(laps * EVENT.lapKm)} km</div>

          {phase === 'live' ? (
            <>
              <button className="big-lap-btn" disabled={busy} onClick={() => run(onAddLap)}>
                <span className="plus">+</span>
                Runde eintragen
              </button>
              {laps > 0 && (
                <div className="undo-row">
                  <button disabled={busy} onClick={() => run(onUndo)}>
                    Ups – letzte Runde zurücknehmen
                  </button>
                </div>
              )}
            </>
          ) : phase === 'before' ? (
            <div className="muted" style={{ fontSize: '0.88rem' }}>
              ⏱ Noch nicht gestartet – du bist angemeldet und startklar.
            </div>
          ) : null}
        </div>

        {me.goalLaps ? (
          <div className="goal-bar">
            <div className="bar">
              <div className="fill" style={{ width: `${Math.min(100, (laps / me.goalLaps) * 100)}%` }} />
            </div>
            <div className="caption">
              {laps >= me.goalLaps
                ? `🎉 Ziel erreicht – ${laps} von ${me.goalLaps} Runden!`
                : `Noch ${me.goalLaps - laps} ${me.goalLaps - laps === 1 ? 'Runde' : 'Runden'} bis zu deinem Ziel von ${me.goalLaps}`}
            </div>
          </div>
        ) : null}
      </div>

      {laps > 0 && (
        <button className="btn btn-secondary btn-block" onClick={() => shareCard(me, badges)}>
          ✨ Story-Bild teilen
        </button>
      )}

      <SplitsList me={me} />
    </div>
  )
}
