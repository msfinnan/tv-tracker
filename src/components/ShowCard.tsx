import { useState, useRef, useEffect } from 'react'
import type { Show, WatchStatus } from '../types'

interface Props {
  show: Show
  onStatusChange: (id: string, status: WatchStatus) => void
  onPriorityChange: (id: string, priority: number) => void
  onDelete: (id: string) => void
  onEdit: (id: string, patch: { title: string; notes?: string; season?: number; episode?: number }) => void
  onEpisodeChange: (id: string, season: number | undefined, episode: number | undefined) => void
}

const STATUS_LABELS: Record<WatchStatus, string> = {
  unwatched: '⬜ Unwatched',
  watching: '▶️ Watching',
  watched: '✅ Watched',
}

const STATUS_CYCLE: Record<WatchStatus, WatchStatus> = {
  unwatched: 'watching',
  watching: 'watched',
  watched: 'unwatched',
}

function formatProgress(season?: number, episode?: number): string | null {
  if (!season && !episode) return null
  const s = season ? `S${season}` : ''
  const e = episode ? `E${episode}` : ''
  return `${s}${s && e ? ' ' : ''}${e}`
}

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
    onEpisodeChange(show.id, show.season || 1, newEp)
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
        <button className="edit-btn" onClick={startEdit} title="Edit">✎</button>
        <select
          className="priority-select"
          value={show.priority}
          title="Priority"
          onChange={e => onPriorityChange(show.id, Number(e.target.value))}
        >
          <option value={1}>P1</option>
          <option value={2}>P2</option>
          <option value={3}>P3</option>
          <option value={4}>P4</option>
          <option value={5}>P5</option>
        </select>
        <button
          className={`status-btn status-${show.status}`}
          onClick={() => onStatusChange(show.id, STATUS_CYCLE[show.status])}
          title="Cycle status"
        >
          {STATUS_LABELS[show.status]}
        </button>
        <button className="delete-btn" onClick={() => onDelete(show.id)} title="Remove">✕</button>
      </div>
    </div>
  )
}
