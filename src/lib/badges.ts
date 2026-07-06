import type { Lap } from '../types'

export interface Badge {
  id: string
  emoji: string
  title: string
  description: string
}

export interface BadgeCheckInput {
  laps: Lap[]
  lapKm: number
}

interface BadgeDef extends Badge {
  earned: (input: BadgeCheckInput) => boolean
}

const km = (i: BadgeCheckInput) => i.laps.length * i.lapKm

/** Stunde 0–5 lokal gilt als Nachtrunde */
export function isNightLap(lap: Lap): boolean {
  const h = new Date(lap.at).getHours()
  return h >= 0 && h < 5
}

export const BADGE_DEFS: BadgeDef[] = [
  {
    id: 'first-lap',
    emoji: '🎉',
    title: 'Angekommen',
    description: 'Erste Runde um den See',
    earned: (i) => i.laps.length >= 1,
  },
  {
    id: 'five-laps',
    emoji: '🔥',
    title: 'Warmgelaufen',
    description: '5 Runden geschafft',
    earned: (i) => i.laps.length >= 5,
  },
  {
    id: 'ten-laps',
    emoji: '💪',
    title: 'Seriensieger',
    description: '10 Runden geschafft',
    earned: (i) => i.laps.length >= 10,
  },
  {
    id: 'half-marathon',
    emoji: '🏅',
    title: 'Halbmarathoni',
    description: 'Mehr als 21,1 km gelaufen',
    earned: (i) => km(i) >= 21.1,
  },
  {
    id: 'marathon',
    emoji: '👑',
    title: 'Marathon-Legende',
    description: 'Mehr als 42,2 km gelaufen',
    earned: (i) => km(i) >= 42.2,
  },
  {
    id: 'night-owl',
    emoji: '🌙',
    title: 'Nachteule',
    description: 'Eine Runde zwischen 0 und 5 Uhr',
    earned: (i) => i.laps.some(isNightLap),
  },
]

export function computeBadges(input: BadgeCheckInput): Badge[] {
  return BADGE_DEFS.filter((b) => b.earned(input)).map(
    ({ id, emoji, title, description }) => ({ id, emoji, title, description }),
  )
}
