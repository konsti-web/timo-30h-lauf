export interface Lap {
  id: string
  /** ISO-Zeitstempel, wann die Runde eingetragen wurde */
  at: string
}

export interface Participant {
  id: string
  name: string
  /** Instagram-Handle ohne @ */
  instagram?: string
  /** Selbstgestecktes Rundenziel */
  goalLaps?: number
  createdAt: string
  laps: Lap[]
}

export type EventPhase = 'before' | 'live' | 'after'

export type Tab = 'home' | 'map' | 'track' | 'board' | 'profile'

export interface Countdown {
  days: number
  hours: number
  minutes: number
  seconds: number
  totalMs: number
}
