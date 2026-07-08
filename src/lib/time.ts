import type { Countdown, EventPhase } from '../types'

export function computeCountdown(now: Date, target: Date): Countdown {
  const totalMs = Math.max(0, target.getTime() - now.getTime())
  const totalSec = Math.floor(totalMs / 1000)
  return {
    days: Math.floor(totalSec / 86400),
    hours: Math.floor((totalSec % 86400) / 3600),
    minutes: Math.floor((totalSec % 3600) / 60),
    seconds: totalSec % 60,
    totalMs,
  }
}

export function eventPhase(now: Date, start: Date, end: Date): EventPhase {
  if (now.getTime() < start.getTime()) return 'before'
  if (now.getTime() < end.getTime()) return 'live'
  return 'after'
}

/** "07:32:45" – verstrichene Zeit seit Start, klemmt bei 0 und Gesamtdauer */
export function formatElapsed(now: Date, start: Date, end: Date): string {
  const ms = Math.min(Math.max(0, now.getTime() - start.getTime()), end.getTime() - start.getTime())
  const s = Math.floor(ms / 1000)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`
}

/** Fortschritt des Events 0..1 */
export function eventProgress(now: Date, start: Date, end: Date): number {
  const total = end.getTime() - start.getTime()
  return Math.min(1, Math.max(0, (now.getTime() - start.getTime()) / total))
}

/** "gerade eben", "vor 5 Min", "vor 3 Std" – für den Live-Feed */
export function formatRelative(iso: string, now: Date): string {
  const diffSec = Math.max(0, Math.floor((now.getTime() - Date.parse(iso)) / 1000))
  if (diffSec < 60) return 'gerade eben'
  if (diffSec < 3600) return `vor ${Math.floor(diffSec / 60)} Min`
  if (diffSec < 86400) return `vor ${Math.floor(diffSec / 3600)} Std`
  const days = Math.floor(diffSec / 86400)
  return days === 1 ? 'vor 1 Tag' : `vor ${days} Tagen`
}

export function formatDateDE(iso: string): string {
  return new Date(iso).toLocaleDateString('de-DE', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function formatTimeDE(iso: string): string {
  return new Date(iso).toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
