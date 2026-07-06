import type { Participant } from '../types'

export interface LeaderboardRow {
  participant: Participant
  rank: number
  laps: number
  km: number
  /** Zeitstempel der letzten Runde, für „gerade aktiv"-Anzeige */
  lastLapAt?: string
}

export interface Totals {
  participants: number
  laps: number
  km: number
}

export function buildLeaderboard(participants: Participant[], lapKm: number): LeaderboardRow[] {
  const rows = participants
    .map((p) => ({
      participant: p,
      laps: p.laps.length,
      km: round1(p.laps.length * lapKm),
      lastLapAt: p.laps.length ? p.laps[p.laps.length - 1].at : undefined,
    }))
    .sort((a, b) => {
      if (b.laps !== a.laps) return b.laps - a.laps
      // Gleichstand: Wer die Rundenzahl zuerst erreicht hat, steht vorn
      const ta = a.lastLapAt ? Date.parse(a.lastLapAt) : Infinity
      const tb = b.lastLapAt ? Date.parse(b.lastLapAt) : Infinity
      if (ta !== tb) return ta - tb
      return a.participant.name.localeCompare(b.participant.name, 'de')
    })

  // Standard competition ranking: gleiche Rundenzahl + gleiche Zeit → gleicher Rang
  let rank = 0
  let prevKey = ''
  return rows.map((r, i) => {
    const key = `${r.laps}|${r.lastLapAt ?? ''}`
    if (key !== prevKey) {
      rank = i + 1
      prevKey = key
    }
    return { ...r, rank }
  })
}

export function computeTotals(participants: Participant[], lapKm: number): Totals {
  const laps = participants.reduce((sum, p) => sum + p.laps.length, 0)
  return { participants: participants.length, laps, km: round1(laps * lapKm) }
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10
}

export function formatKm(km: number): string {
  return km.toLocaleString('de-DE', { maximumFractionDigits: 1 })
}
