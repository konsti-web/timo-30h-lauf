import { describe, it, expect } from 'vitest'
import { computeSplits, bestSplit, formatDuration, formatPace } from './splits'
import type { Lap } from '../types'

const start = new Date('2026-08-15T08:00:00+02:00')
const lap = (id: string, at: string): Lap => ({ id, at })

describe('computeSplits', () => {
  it('Runde 1 zählt ab Eventstart, Runde 2 ab Runde 1', () => {
    const splits = computeSplits(
      [lap('a', '2026-08-15T08:21:00+02:00'), lap('b', '2026-08-15T08:39:00+02:00')],
      start,
      3,
    )
    expect(splits[0].durationMs).toBe(21 * 60_000)
    expect(splits[1].durationMs).toBe(18 * 60_000)
    expect(splits[1].paceSecPerKm).toBe((18 * 60) / 3)
  })

  it('Runde vor Eventstart hat keine Dauer', () => {
    const splits = computeSplits([lap('a', '2026-08-15T07:00:00+02:00')], start, 3)
    expect(splits[0].durationMs).toBeNull()
    expect(splits[0].paceSecPerKm).toBeNull()
  })
})

describe('bestSplit', () => {
  it('findet die schnellste Runde', () => {
    const splits = computeSplits(
      [
        lap('a', '2026-08-15T08:21:00+02:00'),
        lap('b', '2026-08-15T08:39:00+02:00'),
        lap('c', '2026-08-15T09:05:00+02:00'),
      ],
      start,
      3,
    )
    expect(bestSplit(splits)?.n).toBe(2)
  })

  it('null ohne bewertbare Runden', () => {
    expect(bestSplit([])).toBeNull()
  })
})

describe('format', () => {
  it('formatDuration', () => {
    expect(formatDuration(21 * 60_000)).toBe('21:00')
    expect(formatDuration(3723_000)).toBe('1:02:03')
  })
  it('formatPace', () => {
    expect(formatPace(420)).toBe('7:00 /km')
    expect(formatPace(425)).toBe('7:05 /km')
  })
})
