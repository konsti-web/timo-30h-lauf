import { describe, it, expect } from 'vitest'
import { computeBadges, isNightLap } from './badges'
import type { Lap } from '../types'

const day = (i: number): Lap => ({ id: `d${i}`, at: `2026-08-15T1${i}:00:00+02:00` })
const night: Lap = { id: 'n', at: '2026-08-16T03:30:00+02:00' }

describe('computeBadges', () => {
  it('keine Badges ohne Runden', () => {
    expect(computeBadges({ laps: [], lapKm: 3 })).toEqual([])
  })

  it('erste Runde → Angekommen', () => {
    const ids = computeBadges({ laps: [day(0)], lapKm: 3 }).map((b) => b.id)
    expect(ids).toEqual(['first-lap'])
  })

  it('8 Runden à 3 km → 24 km → Halbmarathon-Badge, aber kein Marathon', () => {
    const laps = Array.from({ length: 8 }, (_, i) => day(i))
    const ids = computeBadges({ laps, lapKm: 3 }).map((b) => b.id)
    expect(ids).toContain('half-marathon')
    expect(ids).toContain('five-laps')
    expect(ids).not.toContain('marathon')
  })

  it('Nachtrunde → Nachteule', () => {
    const ids = computeBadges({ laps: [night], lapKm: 3 }).map((b) => b.id)
    expect(ids).toContain('night-owl')
  })
})

describe('isNightLap', () => {
  it('3:30 Uhr ist Nacht, 13 Uhr nicht', () => {
    expect(isNightLap(night)).toBe(true)
    expect(isNightLap(day(3))).toBe(false)
  })
})
