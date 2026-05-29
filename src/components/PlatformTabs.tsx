import { useCallback } from 'react'
import type { Platform } from '../types'

interface Props {
  platforms: Platform[]
  active: string
  onSelect: (id: string) => void
  onAddPlatform: (name: string) => void
}

export function PlatformTabs({ platforms, active, onSelect, onAddPlatform }: Props) {
  const handleAdd = useCallback(() => {
    const name = prompt('Platform name:')?.trim()
    if (name) onAddPlatform(name)
  }, [onAddPlatform])

  return (
    <nav className="platform-tabs">
      {platforms.map(p => (
        <button
          key={p.id}
          className={`tab${p.id === active ? ' active' : ''}`}
          onClick={() => onSelect(p.id)}
        >
          {p.name}
          <span className="tab-count">{p.shows.length}</span>
        </button>
      ))}
      <button className="tab add-platform" onClick={handleAdd} title="Add platform">＋</button>
    </nav>
  )
}
