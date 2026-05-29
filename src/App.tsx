import { useState, useEffect, useMemo } from 'react'
import type { Platform, Show, NewShow, Priority } from './types'
import { loadPlatforms, savePlatforms } from './storage'
import { generateId } from './utils'
import { PlatformTabs } from './components/PlatformTabs'
import { ShowList } from './components/ShowList'
import { ImportExport } from './components/ImportExport'
import { StatsDashboard } from './components/StatsDashboard'

/**
 * Root application component that manages platform and show state.
 * Persists all data to localStorage via the storage module.
 */
export default function App() {
  const [platforms, setPlatforms] = useState<Platform[]>(loadPlatforms)
  // Note: loadPlatforms() is called twice (once for platforms, once for activeId) but is
  // idempotent and cheap. This preserves consistent behavior with tests.
  const [activeId, setActiveId] = useState<string>(() => loadPlatforms()[0]?.id ?? '')

  useEffect(() => {
    savePlatforms(platforms)
  }, [platforms])

  /** The currently selected platform, falling back to the first platform */
  const activePlatform = useMemo(
    () => platforms.find(p => p.id === activeId) ?? platforms[0],
    [platforms, activeId]
  )

  function updatePlatforms(fn: (prev: Platform[]) => Platform[]) {
    setPlatforms(prev => fn(prev))
  }

  /** Adds a new show to the specified platform */
  function addShow(platformId: string, show: NewShow) {
    updatePlatforms(prev =>
      prev.map(p =>
        p.id === platformId
          ? { ...p, shows: [...p.shows, { ...show, id: generateId(), addedAt: Date.now() }] }
          : p
      )
    )
  }

  /** Updates fields on a specific show */
  function updateShow(platformId: string, showId: string, patch: Partial<Show>) {
    updatePlatforms(prev =>
      prev.map(p =>
        p.id === platformId
          ? { ...p, shows: p.shows.map(s => s.id === showId ? { ...s, ...patch } : s) }
          : p
      )
    )
  }

  /** Removes a show from a platform */
  function deleteShow(platformId: string, showId: string) {
    updatePlatforms(prev =>
      prev.map(p =>
        p.id === platformId
          ? { ...p, shows: p.shows.filter(s => s.id !== showId) }
          : p
      )
    )
  }

  /** Creates a new platform and sets it as active */
  function addPlatform(name: string) {
    const id = generateId()
    updatePlatforms(prev => [...prev, { id, name, shows: [] }])
    setActiveId(id)
  }

  /** Replaces all platforms with imported data */
  function importPlatforms(imported: Platform[]) {
    setPlatforms(imported)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>📺 TV Tracker</h1>
        <ImportExport platforms={platforms} onImport={importPlatforms} />
      </header>
      <PlatformTabs
        platforms={platforms}
        active={activeId}
        onSelect={setActiveId}
        onAddPlatform={addPlatform}
      />
      <StatsDashboard platforms={platforms} />
      {activePlatform && (
        <main className="app-main">
          <ShowList
            platform={activePlatform}
            onAddShow={addShow}
            onStatusChange={(pid, sid, status) => updateShow(pid, sid, { status })}
            onPriorityChange={(pid, sid, priority) => updateShow(pid, sid, { priority: priority as Priority })}
            onDeleteShow={deleteShow}
            onEditShow={(pid, sid, patch) => updateShow(pid, sid, patch)}
            onEpisodeChange={(pid, sid, season, episode) => updateShow(pid, sid, { season, episode })}
          />
        </main>
      )}
    </div>
  )
}
