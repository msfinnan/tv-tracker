import { useState } from 'react'
import type { Show, WatchStatus } from '../types'

interface Props {
  show: Show
  onStatusChange: (id: string, status: WatchStatus) => void
  onPriorityChange: (id: string, priority: number) => void
  onDelete: (id: string) => void
  onEdit: (id: string, patch: { title: string; notes?: string }) => void
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

export function ShowCard({ show, onStatusChange, onPriorityChange, onDelete, onEdit }: Props) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(show.title)
  const [notes, setNotes] = useState(show.notes ?? '')

  function startEditing() {
    setTitle(show.title)
    setNotes(show.notes ?? '')
    setEditing(true)
  }

  function save() {
    const trimmed = title.trim()
    if (!trimmed) return
    onEdit(show.id, { title: trimmed, notes: notes.trim() || undefined })
    setEditing(false)
  }

  function cancel() {
    setEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') save()
    if (e.key === 'Escape') cancel()
  }

  if (editing) {
    return (
      <div className={`show-card status-${show.status} editing`}>
        <div className="edit-form">
          <input
            className="edit-input"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Show title"
            autoFocus
          />
          <input
            className="edit-input edit-notes"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Notes (optional)"
          />
          <div className="edit-actions">
            <button className="save-btn" onClick={save}>Save</button>
            <button className="cancel-btn" onClick={cancel}>Cancel</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`show-card status-${show.status}`}>
      <div className="show-main">
        <span className="show-title">{show.title}</span>
        {show.notes && <span className="show-notes">{show.notes}</span>}
      </div>
      <div className="show-controls">
        <button className="edit-btn" onClick={startEditing} title="Edit">✎</button>
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
