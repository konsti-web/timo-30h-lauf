import { EVENT } from '../config'
import { formatDateDE, formatTimeDE } from '../lib/time'
import { LakeMap } from './LakeMap'

export function EventInfo() {
  return (
    <div className="map-grid">
      <div className="card map-card">
        <LakeMap />
      </div>
      <div className="card info-card">
        <h3>Das Wichtigste</h3>
        <ul className="info-list">
          <li>
            <span className="ico">📅</span>
            <span>
              <b>{formatDateDE(EVENT.startISO)}</b>
              Start {formatTimeDE(EVENT.startISO)} Uhr · {EVENT.durationHours} Stunden nonstop
            </span>
          </li>
          <li>
            <span className="ico">📍</span>
            <span>
              <b>{EVENT.location}</b>
              Start/Ziel am Südufer – Parkplätze am Campingplatz
            </span>
          </li>
          <li>
            <span className="ico">🔁</span>
            <span>
              <b>Eine Runde ≈ {EVENT.lapKm.toLocaleString('de-DE')} km</b>
              Flacher Rundweg, auch für Spaziergänger:innen geeignet
            </span>
          </li>
          <li>
            <span className="ico">🤝</span>
            <span>
              <b>Komm, wann du willst</b>
              Lauf eine Runde oder zehn – tags oder nachts. Jede zählt.
            </span>
          </li>
          <li>
            <span className="ico">📲</span>
            <span>
              <b>Runden selbst eintragen</b>
              Nach jeder Runde einfach „+ Runde" in dieser App tippen
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}
