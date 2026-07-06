import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { EVENT } from '../config'
import { LAKE_ROUTE } from '../data/route'

export function LakeMap() {
  const ref = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!ref.current || mapRef.current) return

    const map = L.map(ref.current, {
      center: EVENT.map.center,
      zoom: EVENT.map.zoom,
      scrollWheelZoom: false,
      attributionControl: true,
      zoomControl: false,
    })
    // Zoom unten links – oben liegt die Info-Karte
    L.control.zoom({ position: 'bottomleft' }).addTo(map)
    mapRef.current = map

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map)

    // Laufrunde: Glow-Linie unter der Hauptlinie (Strava-Orange)
    L.polyline(LAKE_ROUTE, { color: '#fc5200', weight: 9, opacity: 0.2 }).addTo(map)
    const route = L.polyline(LAKE_ROUTE, {
      color: '#fc5200',
      weight: 3.5,
      opacity: 0.95,
      lineCap: 'round',
    }).addTo(map)

    L.marker(EVENT.startFinish, {
      icon: L.divIcon({ className: '', html: '<div class="start-marker"></div>', iconSize: [18, 18], iconAnchor: [9, 9] }),
    })
      .addTo(map)
      .bindPopup('<b>Start / Ziel</b><br/>Hier beginnt jede Runde')

    map.fitBounds(route.getBounds(), { padding: [30, 30] })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  return <div ref={ref} className="leaflet-container" role="img" aria-label="Karte der Laufstrecke um den Öschlesee" />
}
