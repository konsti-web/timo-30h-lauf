import type { Participant } from '../types'

export interface RegisterInput {
  name: string
  instagram?: string
  goalLaps?: number
}

/**
 * Abstraktion über die Datenhaltung. Zwei Implementierungen:
 * - LocalAdapter: localStorage, sofort lauffähig (Demo / einzelnes Gerät)
 * - SupabaseAdapter: echtes gemeinsames Live-Leaderboard (via .env aktiviert)
 */
export interface Store {
  /** true = Daten werden zwischen allen Geräten geteilt */
  readonly shared: boolean
  load(): Promise<Participant[]>
  register(input: RegisterInput): Promise<Participant>
  addLap(participantId: string): Promise<void>
  removeLastLap(participantId: string): Promise<void>
  /** Wird bei jeder Datenänderung aufgerufen (auch von anderen Geräten/Tabs) */
  subscribe(onChange: () => void): () => void
}
