import { useCallback, useEffect, useMemo, useState } from 'react'
import type { EventPhase, Participant, Tab } from './types'
import { EVENT_START, EVENT_END } from './config'
import { eventPhase } from './lib/time'
import { createStore, type RegisterInput } from './store'
import { LocalAdapter } from './store/local'
import { TabBar } from './components/TabBar'
import { HomeScreen } from './screens/HomeScreen'
import { MapScreen } from './screens/MapScreen'
import { TrackScreen } from './screens/TrackScreen'
import { BoardScreen } from './screens/BoardScreen'
import { ProfileScreen } from './screens/ProfileScreen'

const ME_KEY = 'timo30h.me.v1'

export default function App() {
  const store = useMemo(() => createStore(), [])
  const [tab, setTab] = useState<Tab>('home')
  const [participants, setParticipants] = useState<Participant[]>([])
  const [meId, setMeId] = useState<string | undefined>(
    () => localStorage.getItem(ME_KEY) ?? undefined,
  )
  const [phase, setPhase] = useState<EventPhase>(() =>
    eventPhase(new Date(), EVENT_START, EVENT_END),
  )

  const refresh = useCallback(async () => {
    setParticipants(await store.load())
  }, [store])

  useEffect(() => {
    refresh()
    const unsubscribe = store.subscribe(refresh)
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

  const navigate = useCallback((t: Tab) => {
    setTab(t)
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [])

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

  const demo =
    store instanceof LocalAdapter
      ? {
          has: store.hasDemo(),
          load: () => store.loadDemo().then(refresh),
          clear: () => store.clearDemo().then(refresh),
        }
      : undefined

  return (
    <div className="app">
      {tab === 'home' && (
        <HomeScreen participants={participants} phase={phase} onNavigate={navigate} />
      )}
      {tab === 'map' && <MapScreen />}
      {tab === 'track' && (
        <TrackScreen
          me={me}
          phase={phase}
          onRegister={register}
          onAddLap={addLap}
          onUndo={undoLap}
        />
      )}
      {tab === 'board' && <BoardScreen participants={participants} meId={meId} phase={phase} />}
      {tab === 'profile' && (
        <ProfileScreen me={me} participants={participants} demo={demo} onNavigate={navigate} />
      )}
      <TabBar active={tab} onChange={navigate} />
    </div>
  )
}
