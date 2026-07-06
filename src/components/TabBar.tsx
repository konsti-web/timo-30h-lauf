import { IconHome, IconMap, IconPlus, IconTrophy, IconUser } from './icons'
import type { Tab } from '../types'

const TABS: { id: Tab; label: string; icon: () => JSX.Element }[] = [
  { id: 'home', label: 'Home', icon: IconHome },
  { id: 'map', label: 'Strecke', icon: IconMap },
  { id: 'track', label: 'Runde', icon: IconPlus },
  { id: 'board', label: 'Board', icon: IconTrophy },
  { id: 'profile', label: 'Du', icon: IconUser },
]

export function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav className="tabbar" aria-label="Hauptnavigation">
      {TABS.map(({ id, label, icon: Icon }) => {
        if (id === 'track') {
          return (
            <button
              key={id}
              className={`tab-item tab-record${active === id ? ' active' : ''}`}
              onClick={() => onChange(id)}
              aria-label="Runde eintragen"
            >
              <span className="record-circle">
                <Icon />
              </span>
              <span>{label}</span>
            </button>
          )
        }
        return (
          <button
            key={id}
            className={`tab-item${active === id ? ' active' : ''}`}
            onClick={() => onChange(id)}
            aria-current={active === id ? 'page' : undefined}
          >
            <Icon />
            <span>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
