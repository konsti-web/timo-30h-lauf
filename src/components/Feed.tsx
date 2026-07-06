import { useEffect, useState } from 'react'
import type { Participant } from '../types'
import { formatRelative } from '../lib/time'

interface FeedEntry {
  key: string
  name: string
  lapNumber: number
  at: string
}

function buildFeed(participants: Participant[], limit: number): FeedEntry[] {
  const entries: FeedEntry[] = []
  for (const p of participants) {
    p.laps.forEach((lap, i) => {
      entries.push({ key: lap.id, name: p.name, lapNumber: i + 1, at: lap.at })
    })
  }
  return entries.sort((a, b) => b.at.localeCompare(a.at)).slice(0, limit)
}

export function Feed({ participants }: { participants: Participant[] }) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])

  const entries = buildFeed(participants, 14)

  if (!entries.length) {
    return (
      <div className="card feed">
        <div className="board-empty">Sobald Runden laufen, siehst du sie hier live. ⚡️</div>
      </div>
    )
  }

  return (
    <div className="card feed">
      {entries.map((e, i) => (
        <div key={e.key} className="feed-row" style={{ animationDelay: `${i * 0.04}s` }}>
          <span className="feed-ico">🏃</span>
          <span className="feed-text">
            <b>{e.name}</b> hat Runde {e.lapNumber} geschafft
          </span>
          <span className="feed-time">{formatRelative(e.at, now)}</span>
        </div>
      ))}
    </div>
  )
}
