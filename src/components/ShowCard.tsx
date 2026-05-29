import { useState, useRef, useEffect } from 'react'
import type { Show, WatchStatus } from '../types'
import { STATUS_CYCLE, PRIORITY_LABELS } from '../constants'

interface Props {
  show: Show
  onStatusChange: (id: string, status: WatchStatus) => void
  onPriorityChange: (id: string, priority: number) => void
  onDelete: (id: string) => void
  onEdit: (id: string, patch: { title: string; notes?: string; season?: number; episode?: number }) => void
  onEpisodeChange?: (id: string, season: number | undefined, episode: number | undefined) => void
}

// Display labels with emoji decoration (component-specific)
const STATUS_DISPLAY: Record<WatchStatus, string> = {
  unwatched: '⬜ Unwatched',
  watching: '▶️ Watching',
  watched: '✅ Watched',
}

/**
 * Formats season and episode numbers into a compact progress string.
 * Returns null if neither season nor episode is provided.
 */
function formatProgress(season?: number, episode?: number): string | null {
  if (!season && !episode) return null
  const s = season ? `S${season}` : ''
  const e = episode ? `E${episode}` : ''
  return `${s}${s && e ? ' ' : ''}${e}`
}

/**
 * Displays a single show with its status, priority, progress, and controls
 * for editing, deleting, and cycling through statuses.
 */
export function ShowCard({ show, onStatusChange, onPriorityChange, onDelete, onEdit, onEpisodeChange }: Props) {
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(show.title)
  const [editNotes, setEditNotes] = useState(show.notes ?? '')
  const [editSeason, setEditSeason] = useState(show.season?.toString() ?? '')
  const [editEpisode, setEditEpisode] = useState(show.episode?.toString() ?? '')
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) titleRef.current?.focus()
  }, [editing])

  function startEdit() {
    setEditTitle(show.title)
    setEditNotes(show.notes ?? '')
    setEditSeason(show.season?.toString() ?? '')
    setEditEpisode(show.episode?.toString() ?? '')
    setEditing(true)
  }

  function saveEdit() {
    const trimmed = editTitle.trim()
    if (!trimmed) return
    onEdit(show.id, {
      title: trimmed,
      notes: editNotes.trim() || undefined,
      season: editSeason ? Number(editSeason) : undefined,
      episode: editEpisode ? Number(editEpisode) : undefined,
    })
    setEditing(false)
  }

  function cancelEdit() {
    setEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') saveEdit()
    if (e.key === 'Escape') cancelEdit()
  }

  function incrementEpisode() {
    const newEp = (show.episode ?? 0) + 1
    onEpisodeChange?.(show.id, show.season || 1, newEp)
  }

  if (editing) {
    return (
      <div className="show-card show-card-editing">
        <div className="edit-form">
          <input
            ref={titleRef}
            className="edit-input"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Show title"
          />
          <div className="form-row">
            <label>
              Season
              <input
                type="number"
                min={1}
                className="edit-input episode-input"
                value={editSeason}
                onChange={e => setEditSeason(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="S"
              />
            </label>
            <label>
              Episode
              <input
                type="number"
                min={1}
                className="edit-input episode-input"
                value={editEpisode}
                onChange={e => setEditEpisode(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="E"
              />
            </label>
          </div>
          <input
            className="edit-input edit-input-notes"
            value={editNotes}
            onChange={e => setEditNotes(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Notes (optional)"
          />
          <div className="edit-actions">
            <button className="edit-save-btn" onClick={saveEdit}>Save</button>
            <button className="edit-cancel-btn" onClick={cancelEdit}>Cancel</button>
          </div>
        </div>
      </div>
    )
  }

  const progress = formatProgress(show.season, show.episode)

  return (
    <div className={`show-card status-${show.status}`}>
      <div className="show-main">
        <div className="show-title-row">
          <span className="show-title">{show.title}</span>
          {progress && <span className="show-progress">{progress}</span>}
        </div>
        {show.notes && <span className="show-notes">{show.notes}</span>}
      </div>
      <div className="show-controls">
        {show.status === 'watching' && (
          <button className="next-ep-btn" onClick={incrementEpisode} title="Next episode">
            +1 Ep
          </button>
        )}
        <button className="edit-btn" onClick={startEdit} title="Edit" aria-label="Edit show">✎</button>
        <select
          className="priority-select"
          value={show.priority}
          title="Priority"
          onChange={e => onPriorityChange(show.id, Number(e.target.value))}
        >
          {Object.keys(PRIORITY_LABELS).map(key => (
            <option key={key} value={key}>{`P${key}`}</option>
          ))}
        </select>
        <button
          className={`status-btn status-${show.status}`}
          onClick={() => onStatusChange(show.id, STATUS_CYCLE[show.status])}
          title="Cycle status"
        >
          {STATUS_DISPLAY[show.status]}
        </button>
        <button className="delete-btn" onClick={() => onDelete(show.id)} title="Remove" aria-label="Delete show">✕</button>
      </div>
    </div>
  )
}
