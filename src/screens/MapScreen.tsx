import { EVENT } from '../config'
import { LakeMap } from '../components/LakeMap'

export function MapScreen() {
  return (
    <div className="map-screen">
      <div className="map-full">
        <LakeMap />
        <div className="map-overlay">
          <div>
            <h2>Die Runde</h2>
            <div className="muted">Start/Ziel am Südufer · flacher Rundweg</div>
          </div>
          <span className="lap-chip">{EVENT.lapKm.toLocaleString('de-DE')} km</span>
        </div>
      </div>
    </div>
  )
}
