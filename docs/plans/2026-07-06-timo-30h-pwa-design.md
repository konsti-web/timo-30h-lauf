# Design: „Timo läuft 30h" – PWA für den 30-Stunden-Lauf am Öschlesee

**Datum:** 2026-07-06 · **Deadline:** Event voraussichtlich Sa, 15.08.2026, 08:00 Uhr (⚠️ User sagte „Samstag 17.08." – der 17.08.2026 ist ein Montag; Datum in `src/config.ts` konfigurierbar)

## Ziel

Eine installierbare PWA für Timo Wassermanns 30-Stunden-Lauf um den Öschlesee (Sulzberg, Oberallgäu). ~100 Teilnehmer laufen Runden mit, registrieren sich unkompliziert und tragen ihre Runden selbst ein. Die App ist gleichzeitig das Fundament für eine Running-Club-App mit Events.

## Entscheidungen

| Frage | Entscheidung | Begründung |
|---|---|---|
| Stack | Vite + React + TypeScript, custom CSS Design-System | Schnell, PWA-ready, volle UI-Kontrolle |
| Backend | Storage-Adapter-Pattern: **LocalAdapter** (sofort lauffähig, localStorage + BroadcastChannel) + **SupabaseAdapter** (fertig, aktiviert via `.env`) | Demo ohne Setup; echtes Live-Leaderboard mit 10 Min Supabase-Setup |
| Runden | Selbst eintragen („+1"-Button), Ehrlichkeitsbasis, Undo | Community-Event, kein Personal nötig |
| Instagram | Handle als Textfeld + Link (kein OAuth) | Instagram-OAuth braucht App-Review – unrealistisch in 13 Tagen |
| Karte | Leaflet + Carto-Dark-Tiles, echte OSM-Geometrie des Öschlesees (Way 8017284, Ufer ~3,4 km) | Passt zum dunklen UI, echte Route |
| Rundenlänge | 3,0 km default, konfigurierbar | Rundweg-Länge vor Ort verifizieren |
| Hosting | Vercel-ready (statischer Build) | Kostenlos, Deployment in Minuten |

## Architektur

```
src/
  config.ts            ← EIN Ort für Datum, Rundenlänge, Namen, Event-Infos
  types.ts             Participant, Lap, EventPhase …
  lib/time.ts          Countdown, Event-Phasen (before/live/after)   [getestet]
  lib/stats.ts         Leaderboard-Aggregation, km-Summen            [getestet]
  lib/badges.ts        Achievements (1. Runde, Nachtläufer, Marathon…) [getestet]
  store/               Store-Interface + LocalAdapter + SupabaseAdapter
  components/          Hero/Countdown, RegisterForm, LapTracker, Leaderboard,
                       CommunityGoal, LakeMap, EventInfo, BadgeWall, EventsList
supabase/schema.sql    Tabellen participants + laps, RLS, Realtime
```

**Drei App-Phasen** (zeitgesteuert aus config):
1. **Vorher:** Countdown groß im Hero, Anmeldung, Event-Infos, Karte
2. **Live (30 h):** „+1 Runde"-Tracker, verstrichene/verbleibende Zeit, Live-Leaderboard, Community-km-Ziel
3. **Danach:** Ergebnis-Feier, finale Zahlen, Badges

## Feature-Set MVP

Countdown · Registrierung (Name, Instagram-Handle, Runden-Ziel) · Runden-Tracking mit Undo & Zeitstempel · Live-Leaderboard · Community-Gesamtziel (alle km zusammen) · Karte mit Runde & Start/Ziel · Badges · PWA (offline, installierbar) · Events-Sektion (Running-Club-Fundament)

## Roadmap-Ideen (bewusst NICHT im MVP)

Instagram-Story-Share-Cards (Canvas) · Push-Notifications · Live-Ticker/Feed · Spenden-Integration · Foto-Wall · Wetter-Widget · QR-Check-in · Admin-Dashboard

## Design-Sprache

Dunkles „Nachtlauf"-Theme (Tiefblau/Schwarz), Signal-Orange als Akzent, Space-Grotesk-Typo (gebündelt, offline-fähig), Glas-Karten, große Zahlen, dezente Animationen (pulsierender Start-Marker, tickender Countdown).

## Tests

Vitest für `lib/` (Countdown-Berechnung, Phasenwechsel, Aggregation, Badge-Regeln). UI-Verifikation via Dev-Server + Browser-Preview.
