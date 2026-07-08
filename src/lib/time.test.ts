import { describe, it, expect } from 'vitest'
import { computeCountdown, eventPhase, formatElapsed, eventProgress, formatRelative } from './time'

const start = new Date('2026-08-15T08:00:00+02:00')
const end = new Date('2026-08-16T14:00:00+02:00') // +30h

describe('computeCountdown', () => {
  it('zählt Tage/Stunden/Minuten/Sekunden korrekt herunter', () => {
    const now = new Date('2026-08-13T06:58:30+02:00')
    const c = computeCountdown(now, start)
    expect(c.days).toBe(2)
    expect(c.hours).toBe(1)
    expect(c.minutes).toBe(1)
    expect(c.seconds).toBe(30)
  })

  it('geht nie unter null', () => {
    const c = computeCountdown(new Date('2026-08-20T00:00:00+02:00'), start)
    expect(c.totalMs).toBe(0)
    expect(c.days + c.hours + c.minutes + c.seconds).toBe(0)
  })
})

describe('eventPhase', () => {
  it('before vor dem Start', () => {
    expect(eventPhase(new Date('2026-08-15T07:59:59+02:00'), start, end)).toBe('before')
  })
  it('live ab Startschuss', () => {
    expect(eventPhase(start, start, end)).toBe('live')
    expect(eventPhase(new Date('2026-08-16T13:59:59+02:00'), start, end)).toBe('live')
  })
  it('after nach 30 Stunden', () => {
    expect(eventPhase(end, start, end)).toBe('after')
  })
})

describe('formatElapsed', () => {
  it('formatiert verstrichene Zeit', () => {
    expect(formatElapsed(new Date('2026-08-15T15:32:45+02:00'), start, end)).toBe('07:32:45')
  })
  it('klemmt bei Gesamtdauer', () => {
    expect(formatElapsed(new Date('2026-08-17T00:00:00+02:00'), start, end)).toBe('30:00:00')
  })
})

describe('formatRelative', () => {
  const now = new Date('2026-08-15T12:00:00+02:00')
  it('staffelt eben/Minuten/Stunden/Tage', () => {
    expect(formatRelative('2026-08-15T11:59:30+02:00', now)).toBe('gerade eben')
    expect(formatRelative('2026-08-15T11:55:00+02:00', now)).toBe('vor 5 Min')
    expect(formatRelative('2026-08-15T09:00:00+02:00', now)).toBe('vor 3 Std')
    expect(formatRelative('2026-08-14T10:00:00+02:00', now)).toBe('vor 1 Tag')
    expect(formatRelative('2026-08-12T10:00:00+02:00', now)).toBe('vor 3 Tagen')
  })
})

describe('eventProgress', () => {
  it('0 vor Start, 0.5 zur Halbzeit, 1 am Ende', () => {
    expect(eventProgress(new Date('2026-08-14T00:00:00+02:00'), start, end)).toBe(0)
    expect(eventProgress(new Date('2026-08-15T23:00:00+02:00'), start, end)).toBeCloseTo(0.5)
    expect(eventProgress(end, start, end)).toBe(1)
  })
})
