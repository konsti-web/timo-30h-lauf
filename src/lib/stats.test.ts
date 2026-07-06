import { describe, it, expect } from 'vitest'
import { buildLeaderboard, computeTotals } from './stats'
import type { Participant } from '../types'

function p(name: string, lapTimes: string[]): Participant {
  return {
    id: name,
    name,
    createdAt: '2026-08-01T00:00:00Z',
    laps: lapTimes.map((at, i) => ({ id: `${name}-${i}`, at })),
  }
}

const anna = p('Anna', ['2026-08-15T09:00:00Z', '2026-08-15T10:00:00Z', '2026-08-15T11:00:00Z'])
const ben = p('Ben', ['2026-08-15T09:30:00Z'])
const cleo = p('Cleo', [])

describe('buildLeaderboard', () => {
  it('sortiert nach Runden absteigend und vergibt Ränge', () => {
    const rows = buildLeaderboard([ben, cleo, anna], 3)
    expect(rows.map((r) => r.participant.name)).toEqual(['Anna', 'Ben', 'Cleo'])
    expect(rows.map((r) => r.rank)).toEqual([1, 2, 3])
    expect(rows[0].km).toBe(9)
  })

  it('bei Gleichstand steht vorn, wer die Runden zuerst lief', () => {
    const früh = p('Früh', ['2026-08-15T09:00:00Z'])
    const spät = p('Spät', ['2026-08-15T12:00:00Z'])
    const rows = buildLeaderboard([spät, früh], 3)
    expect(rows.map((r) => r.participant.name)).toEqual(['Früh', 'Spät'])
    expect(rows.map((r) => r.rank)).toEqual([1, 2])
  })

  it('rundet km auf eine Nachkommastelle', () => {
    const rows = buildLeaderboard([anna], 3.33)
    expect(rows[0].km).toBe(10)
  })
})

describe('computeTotals', () => {
  it('summiert Teilnehmer, Runden und km', () => {
    const t = computeTotals([anna, ben, cleo], 3)
    expect(t).toEqual({ participants: 3, laps: 4, km: 12 })
  })
})
