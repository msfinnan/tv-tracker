import { useState, useEffect } from 'react'
import type { Platform, Show, WatchStatus } from './types'
import { loadPlatforms, savePlatforms } from './storage'
import { PlatformTabs } from './components/PlatformTabs'
import { ShowList } from './components/ShowList'
import { ImportExport } from './components/ImportExport'

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export default function App() {
  const [platforms, setPlatforms] = useState<Platform[]>(loadPlatforms)
  const [activeId, setActiveId] = useState<string>(() => loadPlatforms()[0]?.id ?? '')

  useEffect(() => {
    savePlatforms(platforms)
  }, [platforms])

  const activePlatform = platforms.find(p => p.id === activeId) ?? platforms[0]

  function updatePlatforms(fn: (prev: Platform[]) => Platform[]) {
    setPlatforms(prev => fn(prev))
  }

  function addShow(platformId: string, show: Omit<Show, 'id' | 'addedAt'>) {
    updatePlatforms(prev =>
      prev.map(p =>
        p.id === platformId
          ? { ...p, shows: [...p.shows, { ...show, id: uid(), addedAt: Date.now() }] }
          : p
      )
    )
  }

  function updateShow(platformId: string, showId: string, patch: Partial<Show>) {
    updatePlatforms(prev =>
      prev.map(p =>
        p.id === platformId
          ? { ...p, shows: p.shows.map(s => s.id === showId ? { ...s, ...patch } : s) }
          : p
      )
    )
  }

  function deleteShow(platformId: string, showId: string) {
    updatePlatforms(prev =>
      prev.map(p =>
        p.id === platformId
          ? { ...p, shows: p.shows.filter(s => s.id !== showId) }
          : p
      )
    )
  }

  function addPlatform(name: string) {
    const id = uid()
    updatePlatforms(prev => [...prev, { id, name, shows: [] }])
    setActiveId(id)
  }

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
      {activePlatform && (
        <main className="app-main">
          <ShowList
            platform={activePlatform}
            onAddShow={addShow}
            onStatusChange={(pid, sid, status) => updateShow(pid, sid, { status })}
            onPriorityChange={(pid, sid, priority) => updateShow(pid, sid, { priority })}
            onDeleteShow={deleteShow}
            onEditShow={(pid, sid, patch) => updateShow(pid, sid, patch)}
          />
        </main>
      )}
    </div>
  )
}
