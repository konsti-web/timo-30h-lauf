import { useEffect, useState } from 'react'
import type { EventPhase, Participant, Tab } from '../types'
import { EVENT, EVENT_START, EVENT_END, UPCOMING_EVENTS } from '../config'
import { computeCountdown, eventProgress, formatDateDE, formatElapsed, formatRelative, formatTimeDE } from '../lib/time'
import { computeTotals, formatKm } from '../lib/stats'
import { Avatar } from '../components/Avatar'
import { SponsorMarquee } from '../components/SponsorMarquee'

function useNow(intervalMs: number): Date {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}

function CountdownGrid() {
  const now = useNow(1000)
  const c = computeCountdown(now, EVENT_START)
  const cells = [
    { v: c.days, l: 'Tage' },
    { v: c.hours, l: 'Std' },
    { v: c.minutes, l: 'Min' },
    { v: c.seconds, l: 'Sek', cls: 'seconds' },
  ]
  return (
    <div className="countdown" role="timer" aria-label="Countdown bis zum Start">
      {cells.map(({ v, l, cls }) => (
        <div key={l} className={`count-cell ${cls ?? ''}`}>
          <div className="num">{String(v).padStart(2, '0')}</div>
          <div className="label">{l}</div>
        </div>
      ))}
    </div>
  )
}

function LiveProgress() {
  const now = useNow(1000)
  const remaining = computeCountdown(now, EVENT_END)
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    <div className="card">
      <div className="live-progress">
        <div className="row">
          <div>
            <div className="big">{formatElapsed(now, EVENT_START, EVENT_END)}</div>
            <div className="k">Läuft seit</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="big">
              {pad(remaining.days * 24 + remaining.hours)}:{pad(remaining.minutes)}:{pad(remaining.seconds)}
            </div>
            <div className="k">Verbleibend</div>
          </div>
        </div>
        <div className="bar">
          <div className="fill" style={{ width: `${eventProgress(now, EVENT_START, EVENT_END) * 100}%` }} />
        </div>
      </div>
    </div>
  )
}

interface FeedEntry {
  key: string
  name: string
  lapNumber: number
  at: string
}

function buildFeed(participants: Participant[], limit: number): FeedEntry[] {
  const entries: FeedEntry[] = []
  for (const p of participants) {
    p.laps.forEach((lap, i) => {
      entries.push({ key: lap.id, name: p.name, lapNumber: i + 1, at: lap.at })
    })
  }
  return entries.sort((a, b) => b.at.localeCompare(a.at)).slice(0, limit)
}

export function HomeScreen({
  participants,
  phase,
  onNavigate,
}: {
  participants: Participant[]
  phase: EventPhase
  onNavigate: (tab: Tab) => void
}) {
  const now = useNow(30_000)
  const totals = computeTotals(participants, EVENT.lapKm)
  const pct = Math.min(100, Math.round((totals.km / EVENT.communityGoalKm) * 100))
  const feed = buildFeed(participants, 8)
  const R = 46
  const C = 2 * Math.PI * R

  return (
    <div className="screen">
      <div className="screen-head">
        <div>
          <h1>{EVENT.title}</h1>
          <div className="sub">{EVENT.location}</div>
        </div>
        {phase === 'live' && (
          <span className="live-pill">
            <span className="live-dot" />
            Live
          </span>
        )}
      </div>

      <div className="card event-hero">
        <div className="card-pad">
          <div className="kicker">
            {phase === 'before' && 'Es geht bald los'}
            {phase === 'live' && 'Jetzt live am Öschlesee'}
            {phase === 'after' && 'Geschafft! 🎉'}
          </div>
          <h2>
            {EVENT.durationHours} Stunden
            <br />
            um den Öschlesee
          </h2>
          <div className="meta">
            <b>{formatDateDE(EVENT.startISO)}</b> · Start {formatTimeDE(EVENT.startISO)} Uhr
            <br />
            Lauf mit – jede Runde ({EVENT.lapKm.toLocaleString('de-DE')} km) zählt.
          </div>
        </div>
      </div>

      {phase === 'before' && <CountdownGrid />}
      {phase === 'live' && <LiveProgress />}

      {phase !== 'after' && (
        <button
          className="btn btn-primary btn-block"
          style={{ marginTop: 14 }}
          onClick={() => onNavigate('track')}
        >
          {phase === 'live' ? 'Runde eintragen' : 'Ich laufe mit'}
        </button>
      )}

      <div className="section-label">Community-Ziel</div>
      <div className="card goal-card">
        <div className="card-pad">
          <div className="ring-wrap">
            <svg width="108" height="108" viewBox="0 0 108 108" aria-hidden="true">
              <circle cx="54" cy="54" r={R} fill="none" stroke="#eee9e6" strokeWidth="10" />
              <circle
                cx="54" cy="54" r={R} fill="none"
                stroke="#fc5200" strokeWidth="10" strokeLinecap="round"
                strokeDasharray={C} strokeDashoffset={C * (1 - pct / 100)}
                style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)' }}
              />
            </svg>
            <div className="ring-center">
              <div>
                <div className="pct">{pct} %</div>
                <div className="lbl">von {EVENT.communityGoalKm.toLocaleString('de-DE')} km</div>
              </div>
            </div>
          </div>
          <div className="goal-stats">
            <div className="row">
              <span className="k">Gesamt</span>
              <span className="v">{formatKm(totals.km)} km</span>
            </div>
            <div className="row">
              <span className="k">Runden</span>
              <span className="v">{totals.laps}</span>
            </div>
            <div className="row">
              <span className="k">Läufer:innen</span>
              <span className="v">{totals.participants}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="section-label">Unterstützt von</div>
      <SponsorMarquee />

      <div className="section-label">Live-Ticker</div>
      <div className="card">
        {feed.length === 0 ? (
          <div className="board-empty">Sobald Runden laufen, siehst du sie hier. ⚡️</div>
        ) : (
          feed.map((e) => (
            <div key={e.key} className="feed-card">
              <Avatar name={e.name} />
              <span className="txt">
                <b>{e.name}</b> <span className="what">hat Runde {e.lapNumber} geschafft</span>
              </span>
              <span className="when">{formatRelative(e.at, now)}</span>
            </div>
          ))
        )}
      </div>

      <div className="section-label">Nächste Events</div>
      <div className="card">
        {UPCOMING_EVENTS.map((ev) => {
          const d = new Date(ev.date)
          return (
            <div key={ev.id} className={`event-row${ev.highlight ? ' highlight' : ''}`}>
              <div className="event-date">
                <div className="d">{d.getDate()}</div>
                <div className="m">{d.toLocaleDateString('de-DE', { month: 'short' }).replace('.', '')}</div>
              </div>
              <div>
                <div className="e-title">{ev.title}</div>
                <div className="e-sub">
                  {ev.location} · {d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
