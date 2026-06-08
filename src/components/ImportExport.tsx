import { useRef, useState } from 'react'
import type { Platform } from '../types'
import { validateImportData } from '../validation'

interface Props {
  platforms: Platform[]
  onImport: (platforms: Platform[]) => void
}

type ImportMode = 'replace' | 'merge'

function mergePlatforms(existing: Platform[], incoming: Platform[]): Platform[] {
  const merged = [...existing]

  for (const incomingPlatform of incoming) {
    const existingIndex = merged.findIndex(p => p.id === incomingPlatform.id)

    if (existingIndex === -1) {
      // New platform — add it
      merged.push(incomingPlatform)
    } else {
      // Existing platform — merge shows (skip duplicates by id)
      const existingShows = merged[existingIndex].shows
      const existingShowIds = new Set(existingShows.map(s => s.id))
      const newShows = incomingPlatform.shows.filter(s => !existingShowIds.has(s.id))
      merged[existingIndex] = {
        ...merged[existingIndex],
        shows: [...existingShows, ...newShows],
      }
    }
  }

  return merged
}

export function ImportExport({ platforms, onImport }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importMode, setImportMode] = useState<ImportMode>('merge')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  function handleExport() {
    const json = JSON.stringify(platforms, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tv-tracker-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setMessage({ type: 'success', text: 'Watchlist exported successfully!' })
  }

  function handleImportClick() {
    fileInputRef.current?.click()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)
        const validData = validateImportData(data)

        if (!validData) {
          setMessage({ type: 'error', text: 'Invalid file format. Expected a TV Tracker export file.' })
          return
        }

        if (importMode === 'replace') {
          onImport(validData)
          setMessage({ type: 'success', text: `Imported ${validData.length} platform(s). Previous data replaced.` })
        } else {
          const merged = mergePlatforms(platforms, validData)
          onImport(merged)
          const newShows = merged.reduce((sum, p) => sum + p.shows.length, 0) -
            platforms.reduce((sum, p) => sum + p.shows.length, 0)
          setMessage({ type: 'success', text: `Merged successfully! ${newShows} new show(s) added.` })
        }
      } catch {
        setMessage({ type: 'error', text: 'Could not read file. Make sure it is a valid JSON file.' })
      }
    }
    reader.readAsText(file)

    // Reset file input so the same file can be re-imported if needed
    e.target.value = ''
  }

  return (
    <div className="import-export">
      <div className="import-export-actions">
        <button className="btn-export" onClick={handleExport} title="Download your watchlist as JSON">
          ⬇ Export
        </button>

        <div className="import-group">
          <button className="btn-import" onClick={handleImportClick} title="Import a watchlist from JSON file">
            ⬆ Import
          </button>
          <select
            className="import-mode-select"
            value={importMode}
            onChange={(e) => setImportMode(e.target.value as ImportMode)}
            title="Choose how to handle imported data"
          >
            <option value="merge">Merge</option>
            <option value="replace">Replace</option>
          </select>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      {message && (
        <div className={`import-export-message ${message.type}`}>
          {message.text}
          <button className="dismiss-btn" onClick={() => setMessage(null)}>✕</button>
        </div>
      )}
    </div>
  )
}
