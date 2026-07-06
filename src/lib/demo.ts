import type { Participant } from '../types'

const FIRST = ['Lena', 'Ben', 'Mia', 'Jonas', 'Emma', 'Luis', 'Hannah', 'Felix', 'Clara', 'Noah', 'Lea', 'Paul', 'Marie', 'David', 'Sophie', 'Tim', 'Anna', 'Max', 'Julia', 'Simon', 'Laura', 'Moritz', 'Nina', 'Tom', 'Sarah', 'Jan', 'Lisa', 'Erik', 'Katharina', 'Florian']
const LAST = ['Maier', 'Huber', 'Wagner', 'Berger', 'Fischer', 'Weber', 'Schmid', 'Keller', 'Braun', 'Wolf', 'Bauer', 'Koch', 'Richter', 'Klein', 'Schwarz', 'Zimmermann', 'Krüger', 'Hofmann', 'Lang', 'Vogel']

export const DEMO_PREFIX = 'demo-'

/**
 * Erzeugt eine lebendige Demo-Community: ~35 Läufer:innen mit realistischen
 * Rundenzeiten über die letzten Stunden verteilt (damit Feed & Badges greifen).
 */
export function generateDemoParticipants(now = new Date()): Participant[] {
  const rnd = mulberry32(30)
  const count = 32 + Math.floor(rnd() * 6)
  const used = new Set<string>()
  const result: Participant[] = []

  for (let i = 0; i < count; i++) {
    let name = ''
    do {
      name = `${FIRST[Math.floor(rnd() * FIRST.length)]} ${LAST[Math.floor(rnd() * LAST.length)]}`
    } while (used.has(name))
    used.add(name)

    // Verteilung: viele mit 1–5 Runden, wenige Vielläufer
    const laps = rnd() < 0.15 ? 8 + Math.floor(rnd() * 10) : 1 + Math.floor(rnd() * 5)
    // Läufer startete vor 1–9 Stunden, Runden im Schnitt alle 25–45 Min
    const startedAgoMs = (1 + rnd() * 8) * 3600_000
    const lapEveryMs = (25 + rnd() * 20) * 60_000
    const lapTimes: string[] = []
    for (let l = 0; l < laps; l++) {
      const t = now.getTime() - startedAgoMs + l * lapEveryMs * (0.85 + rnd() * 0.3)
      if (t > now.getTime()) break
      lapTimes.push(new Date(t).toISOString())
    }

    result.push({
      id: `${DEMO_PREFIX}${i}`,
      name,
      instagram: rnd() < 0.6 ? name.toLowerCase().replace(' ', '.') : undefined,
      goalLaps: rnd() < 0.5 ? 3 + Math.floor(rnd() * 10) : undefined,
      createdAt: new Date(now.getTime() - startedAgoMs).toISOString(),
      laps: lapTimes.map((at, l) => ({ id: `${DEMO_PREFIX}${i}-${l}`, at })),
    })
  }
  return result
}

export function isDemo(p: Participant): boolean {
  return p.id.startsWith(DEMO_PREFIX)
}

/** Deterministischer PRNG, damit die Demo-Community stabil bleibt */
function mulberry32(seed: number): () => number {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
