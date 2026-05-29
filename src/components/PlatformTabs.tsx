import type { Platform } from '../types'

interface Props {
  platforms: Platform[]
  active: string
  onSelect: (id: string) => void
  onAddPlatform: (name: string) => void
}

/**
 * Navigation tabs for switching between streaming platforms.
 * Shows a count badge on each tab and a button to add new platforms.
 */
export function PlatformTabs({ platforms, active, onSelect, onAddPlatform }: Props) {
  function handleAdd() {
    // TODO: Replace window.prompt with a proper modal dialog for better UX
    const name = prompt('Platform name:')?.trim()
    if (name) onAddPlatform(name)
  }

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
