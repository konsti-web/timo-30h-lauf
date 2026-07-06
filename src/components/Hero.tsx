import type { EventPhase } from '../types'
import { EVENT } from '../config'
import { formatDateDE, formatTimeDE } from '../lib/time'
import { Countdown } from './Countdown'

export function Hero({ phase, onJoin }: { phase: EventPhase; onJoin: () => void }) {
  return (
    <div className="hero fade-in">
      <span className="kicker">
        {phase === 'before' && 'Es geht bald los'}
        {phase === 'live' && 'Jetzt live am Öschlesee'}
        {phase === 'after' && 'Wir haben es geschafft'}
      </span>
      <h1>
        {EVENT.title.replace(' 30h', '')} <span className="accent">30 Stunden</span>
        <br />
        um den Öschlesee
      </h1>
      <p className="sub">
        {EVENT.runnerName} läuft {EVENT.durationHours} Stunden nonstop – und du kannst
        mitlaufen. Jede Runde zählt. Komm vorbei, dreh so viele Runden wie du magst und
        werde Teil des Community-Ziels.
      </p>
      <div className="hero-meta">
        <span className="chip">📅 {formatDateDE(EVENT.startISO)}</span>
        <span className="chip">🕗 Start {formatTimeDE(EVENT.startISO)} Uhr</span>
        <span className="chip">📍 {EVENT.location}</span>
        <span className="chip">🔁 Runde ≈ {EVENT.lapKm.toLocaleString('de-DE')} km</span>
      </div>

      {phase === 'before' && <Countdown />}

      <div className="cta-row">
        <button className="btn btn-primary" onClick={onJoin}>
          {phase === 'after' ? 'Ergebnisse ansehen' : 'Ich laufe mit →'}
        </button>
        <a className="btn btn-ghost" href="#strecke">
          Strecke ansehen
        </a>
      </div>
    </div>
  )
}
