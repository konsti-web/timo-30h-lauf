import type { Participant } from '../types'
import type { RegisterInput, Store } from './types'
import { generateDemoParticipants, isDemo } from '../lib/demo'

const KEY = 'timo30h.participants.v1'
const CHANNEL = 'timo30h-sync'

function uid(): string {
  return crypto.randomUUID()
}

function read(): Participant[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as Participant[]
  } catch {
    return []
  }
}

/**
 * Demo-/Einzelgerät-Modus: Daten in localStorage, Tab-Sync via BroadcastChannel.
 * Für das echte gemeinsame Leaderboard den SupabaseAdapter aktivieren (README).
 */
export class LocalAdapter implements Store {
  readonly shared = false
  private channel = new BroadcastChannel(CHANNEL)

  private write(participants: Participant[]) {
    localStorage.setItem(KEY, JSON.stringify(participants))
    this.channel.postMessage('changed')
  }

  async load(): Promise<Participant[]> {
    return read()
  }

  async register(input: RegisterInput): Promise<Participant> {
    const participant: Participant = {
      id: uid(),
      name: input.name.trim(),
      instagram: input.instagram?.trim().replace(/^@/, '') || undefined,
      goalLaps: input.goalLaps,
      createdAt: new Date().toISOString(),
      laps: [],
    }
    this.write([...read(), participant])
    return participant
  }

  async addLap(participantId: string): Promise<void> {
    const all = read()
    const p = all.find((x) => x.id === participantId)
    if (!p) throw new Error('Teilnehmer nicht gefunden')
    p.laps.push({ id: uid(), at: new Date().toISOString() })
    this.write(all)
  }

  async removeLastLap(participantId: string): Promise<void> {
    const all = read()
    const p = all.find((x) => x.id === participantId)
    if (!p || p.laps.length === 0) return
    p.laps.pop()
    this.write(all)
  }

  /** Demo-Community einspielen (nur LocalAdapter) – zeigt die App „voll" */
  async loadDemo(): Promise<void> {
    const real = read().filter((p) => !isDemo(p))
    this.write([...real, ...generateDemoParticipants()])
  }

  async clearDemo(): Promise<void> {
    this.write(read().filter((p) => !isDemo(p)))
  }

  hasDemo(): boolean {
    return read().some(isDemo)
  }

  subscribe(onChange: () => void): () => void {
    const handler = () => onChange()
    this.channel.addEventListener('message', handler)
    // storage-Event fängt Änderungen aus anderen Tabs ohne BroadcastChannel
    window.addEventListener('storage', handler)
    return () => {
      this.channel.removeEventListener('message', handler)
      window.removeEventListener('storage', handler)
    }
  }
}
