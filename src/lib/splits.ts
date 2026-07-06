import type { Lap } from '../types'

export interface Split {
  /** Rundennummer, 1-basiert */
  n: number
  at: string
  /** Dauer der Runde in ms – null, wenn nicht bestimmbar (z. B. Runde vor Eventstart) */
  durationMs: number | null
  /** Pace in Sekunden pro km – null wie oben */
  paceSecPerKm: number | null
}

/**
 * Rundenzeiten aus den Eintrag-Zeitstempeln: Runde 1 zählt ab Eventstart,
 * jede weitere ab der vorherigen Runde.
 */
export function computeSplits(laps: Lap[], eventStart: Date, lapKm: number): Split[] {
  return laps.map((lap, i) => {
    const end = Date.parse(lap.at)
    const start = i === 0 ? eventStart.getTime() : Date.parse(laps[i - 1].at)
    const durationMs = end > start ? end - start : null
    return {
      n: i + 1,
      at: lap.at,
      durationMs,
      paceSecPerKm: durationMs !== null && lapKm > 0 ? durationMs / 1000 / lapKm : null,
    }
  })
}

/** Schnellste Runde (kleinste Dauer); null wenn keine bewertbar */
export function bestSplit(splits: Split[]): Split | null {
  const rated = splits.filter((s) => s.durationMs !== null)
  if (!rated.length) return null
  return rated.reduce((a, b) => (b.durationMs! < a.durationMs! ? b : a))
}

/** "42:30" oder "1:02:15" */
export function formatDuration(ms: number): string {
  const s = Math.round(ms / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`
}

/** "7:05 /km" */
export function formatPace(secPerKm: number): string {
  const m = Math.floor(secPerKm / 60)
  const s = Math.round(secPerKm % 60)
  return `${m}:${String(s).padStart(2, '0')} /km`
}
