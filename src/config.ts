/**
 * ⚙️ ZENTRALE EVENT-KONFIGURATION
 * Alles, was sich vor dem Event noch ändern kann, steht hier an EINEM Ort.
 */
export const EVENT = {
  runnerName: 'Timo Wassermann',
  title: 'Timo läuft 30h',
  subtitle: 'Um den Öschlesee',
  /** Start: Freitag, 17. Juli 2026, 15:00 Uhr → Ende: Samstag, 21:00 Uhr */
  startISO: '2026-07-17T15:00:00+02:00',
  durationHours: 30,
  /** Rundenlänge in km – Rundweg vor Ort verifizieren (Ufer ≈ 3,4 km) */
  lapKm: 3.0,
  location: 'Öschlesee, Sulzberg (Oberallgäu)',
  /** Gemeinsames Community-Ziel in km (alle Teilnehmer zusammen) */
  communityGoalKm: 1000,
  instagram: 'timo.wassermann',
  /** Kartenzentrum + Zoom */
  map: { center: [47.6798, 10.3373] as [number, number], zoom: 15 },
  /** Start/Ziel-Punkt an der Strecke (Südwest-Ufer, nahe Campingplatz) */
  startFinish: [47.676518, 10.334434] as [number, number],
} as const

export const EVENT_START = new Date(EVENT.startISO)
export const EVENT_END = new Date(
  EVENT_START.getTime() + EVENT.durationHours * 3600_000,
)

/** Sponsoren – laufen als Marquee-Slider auf dem Home-Screen */
export const SPONSORS = [
  { id: 'redbull', name: 'Red Bull', category: 'Energy', mono: 'RB', from: '#001a4d', to: '#0a3ba8', accent: '#e30613' },
  { id: 'abt', name: 'ABT', category: 'Automobile', mono: 'A', from: '#111111', to: '#333333', accent: '#e2001a' },
  { id: 'cordella', name: 'Cordella', category: 'Eis', mono: 'C', from: '#ff7ab8', to: '#ffb3d4', accent: '#7a3e2e' },
] as const

/** Kommende Club-Events (Running-Club-Fundament) */
export const UPCOMING_EVENTS = [
  {
    id: 'timo-30h-2026',
    date: EVENT.startISO,
    title: 'Timo läuft 30h – Öschlesee',
    description:
      '30 Stunden am Stück. Lauf so viele Runden mit, wie du willst – jede zählt fürs Community-Ziel.',
    location: 'Öschlesee, Sulzberg',
    highlight: true,
  },
  {
    id: 'social-run-1',
    date: '2026-09-05T09:00:00+02:00',
    title: 'Social Run – Auslaufen & Brunch',
    description: 'Lockere 5 km, danach gemeinsames Frühstück. Alle Tempos willkommen.',
    location: 'Öschlesee, Sulzberg',
    highlight: false,
  },
  {
    id: 'trail-herbst',
    date: '2026-10-10T10:00:00+02:00',
    title: 'Herbst-Trailrun Allgäu',
    description: 'Gemeinsamer Trail über die Allgäuer Hügel – Details folgen.',
    location: 'Sulzberg',
    highlight: false,
  },
]
