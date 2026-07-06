# Timo läuft 30h – Öschlesee 🏃🌙

**Live: https://konsti-web.github.io/timo-30h-lauf/** — jeder Push auf `main`
deployt automatisch via GitHub Actions.

Installierbare PWA für den 30-Stunden-Lauf von Timo Wassermann um den Öschlesee
(Sulzberg, Oberallgäu): Countdown, unkomplizierte Anmeldung, Runden-Tracking,
Live-Leaderboard, Community-Ziel, Karte mit echter Strecke, Badges und
Event-Übersicht für den Running Club.

## Schnellstart

```bash
npm install
npm run dev        # → http://localhost:5173
```

Die App läuft sofort im **Demo-Modus** (Daten nur auf dem eigenen Gerät).

## ⚠️ Vor dem Event: 2 Dinge prüfen

1. **Startdatum** in [`src/config.ts`](src/config.ts): eingetragen ist
   **Sa, 15.08.2026, 08:00 Uhr**. (Hinweis: „17.08." wäre 2026 ein Montag.)
2. **Rundenlänge** `lapKm`: aktuell 3,0 km – die tatsächliche Rundweg-Länge
   vor Ort messen und ggf. anpassen. Alles andere (Ziel-km, Instagram-Handle,
   Events) steht ebenfalls in dieser einen Datei.

## Echtes Live-Leaderboard aktivieren (Supabase, ~10 Minuten)

Ohne Backend sieht jeder nur die eigenen Daten. Für das gemeinsame Leaderboard:

1. Kostenloses Projekt auf [supabase.com](https://supabase.com) anlegen
2. Im **SQL-Editor** den Inhalt von [`supabase/schema.sql`](supabase/schema.sql) ausführen
3. `.env.example` nach `.env` kopieren und URL + Anon-Key aus
   *Project Settings → API* eintragen
4. Neu bauen/deployen – fertig. Runden erscheinen bei allen live.

## Deployment (Vercel, kostenlos)

```bash
npm i -g vercel
vercel            # im Projektordner; Framework: Vite wird erkannt
```

Die beiden `VITE_SUPABASE_*`-Variablen im Vercel-Dashboard unter
*Settings → Environment Variables* eintragen. Danach ist die App unter einer
festen URL erreichbar und kann vom Handy-Homescreen aus wie eine native App
installiert werden („Zum Home-Bildschirm hinzufügen").

## Tests & Build

```bash
npm test           # Vitest: Countdown, Phasen, Leaderboard, Badges
npm run build      # Produktions-Build inkl. PWA/Service-Worker
```

## Architektur

- **Vite + React + TypeScript**, custom CSS-Design-System („Nachtlauf"-Theme)
- **Storage-Adapter**: `src/store/` – `LocalAdapter` (localStorage) oder
  `SupabaseAdapter` (Realtime), automatisch gewählt über `.env`
- **Karte**: Leaflet + Carto-Dark-Tiles, echte OSM-Geometrie des Öschlesees
- **PWA**: offline-fähig (auch Kartenkacheln werden gecacht), installierbar
- Design-Doku: [`docs/plans/2026-07-06-timo-30h-pwa-design.md`](docs/plans/2026-07-06-timo-30h-pwa-design.md)
