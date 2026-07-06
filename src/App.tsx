import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { EventPhase, Participant } from './types'
import { EVENT, EVENT_START, EVENT_END } from './config'
import { eventPhase } from './lib/time'
import { createStore, type RegisterInput } from './store'
import { Hero } from './components/Hero'
import { RegisterForm } from './components/RegisterForm'
import { LapTracker } from './components/LapTracker'
import { Leaderboard } from './components/Leaderboard'
import { CommunityGoal } from './components/CommunityGoal'
import { EventInfo } from './components/EventInfo'
import { BadgeWall } from './components/BadgeWall'
import { EventsList } from './components/EventsList'
import { LiveBanner } from './components/LiveBanner'

const ME_KEY = 'timo30h.me.v1'

export default function App() {
  const store = useMemo(() => createStore(), [])
  const [participants, setParticipants] = useState<Participant[]>([])
  const [meId, setMeId] = useState<string | undefined>(
    () => localStorage.getItem(ME_KEY) ?? undefined,
  )
  const [phase, setPhase] = useState<EventPhase>(() =>
    eventPhase(new Date(), EVENT_START, EVENT_END),
  )
  const joinRef = useRef<HTMLDivElement>(null)

  const refresh = useCallback(async () => {
    setParticipants(await store.load())
  }, [store])

  useEffect(() => {
    refresh()
    const unsubscribe = store.subscribe(refresh)
    // Phase minütlich prüfen (before → live → after)
    const id = setInterval(
      () => setPhase(eventPhase(new Date(), EVENT_START, EVENT_END)),
      30_000,
    )
    return () => {
      unsubscribe()
      clearInterval(id)
    }
  }, [store, refresh])

  const me = participants.find((p) => p.id === meId)

  async function register(input: RegisterInput) {
    const participant = await store.register(input)
    localStorage.setItem(ME_KEY, participant.id)
    setMeId(participant.id)
    await refresh()
  }

  async function addLap() {
    if (!meId) return
    await store.addLap(meId)
    await refresh()
  }

  async function undoLap() {
    if (!meId) return
    await store.removeLastLap(meId)
    await refresh()
  }

  function scrollToJoin() {
    joinRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <>
      <header className="topbar">
        <span className="brand">
          <span className="brand-dot">30h</span>
          {EVENT.title}
        </span>
        <nav>
          <a href="#mitmachen">Mitmachen</a>
          <a href="#leaderboard">Leaderboard</a>
          <a href="#strecke">Strecke</a>
          <a href="#events">Events</a>
        </nav>
        {phase === 'live' && (
          <span className="live-pill">
            <span className="live-dot" />
            Live
          </span>
        )}
      </header>

      <main className="shell">
        <Hero phase={phase} onJoin={scrollToJoin} />

        {phase === 'live' && <LiveBanner />}

        {!store.shared && (
          <p className="demo-note">
            ⚠️ Demo-Modus: Daten bleiben nur auf diesem Gerät. Für das gemeinsame
            Live-Leaderboard Supabase aktivieren (siehe README).
          </p>
        )}

        <section id="mitmachen" ref={joinRef}>
          <span className="kicker">Mitmachen</span>
          <h2 className="section-title">{me ? 'Dein Lauf' : 'In 10 Sekunden dabei'}</h2>
          <p className="section-sub">
            {me
              ? 'Trag nach jeder Runde ein, dass du sie geschafft hast – dein Fortschritt landet sofort im Leaderboard.'
              : 'Melde dich an und zähl deine Runden mit – egal ob eine oder fünfzig.'}
          </p>
          {me ? (
            <LapTracker me={me} phase={phase} onAddLap={addLap} onUndo={undoLap} />
          ) : (
            <RegisterForm onRegister={register} />
          )}
        </section>

        <section id="community">
          <CommunityGoal participants={participants} />
        </section>

        <section id="leaderboard">
          <span className="kicker">Leaderboard</span>
          <h2 className="section-title">
            {phase === 'after' ? 'Das Endergebnis' : 'Wer läuft wie viel?'}
          </h2>
          <p className="section-sub">
            {phase === 'live'
              ? 'Aktualisiert sich live, während gelaufen wird.'
              : 'Alle angemeldeten Läufer:innen und ihre Runden.'}
          </p>
          <Leaderboard participants={participants} meId={meId} />
        </section>

        <section id="strecke">
          <span className="kicker">Die Strecke</span>
          <h2 className="section-title">Eine Runde um den Öschlesee</h2>
          <p className="section-sub">
            Der Rundweg führt einmal komplett um den See – flach, wunderschön und bei
            Nacht mit Stirnlampe ein Erlebnis.
          </p>
          <EventInfo />
        </section>

        <section id="badges">
          <span className="kicker">Achievements</span>
          <h2 className="section-title">Deine Badges</h2>
          <p className="section-sub">
            {me
              ? 'Diese Auszeichnungen kannst du dir beim Lauf verdienen.'
              : 'Melde dich an und sammle beim Lauf diese Auszeichnungen.'}
          </p>
          <BadgeWall me={me} />
        </section>

        <section id="events">
          <span className="kicker">Running Club</span>
          <h2 className="section-title">Nächste Events</h2>
          <p className="section-sub">
            Der 30-Stunden-Lauf ist erst der Anfang – hier findest du alle kommenden
            Läufe der Community.
          </p>
          <EventsList />
        </section>

        <footer>
          <span>
            {EVENT.title} · {EVENT.location}
          </span>
          <a
            href={`https://instagram.com/${EVENT.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            @{EVENT.instagram} auf Instagram
          </a>
        </footer>
      </main>
    </>
  )
}
