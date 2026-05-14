import { useState, useRef, useEffect } from 'react'
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
  const [editTitle, setEditTitle] = useState(show.title)
  const [editNotes, setEditNotes] = useState(show.notes ?? '')
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) titleRef.current?.focus()
  }, [editing])

  function startEdit() {
    setEditTitle(show.title)
    setEditNotes(show.notes ?? '')
    setEditing(true)
  }

  function saveEdit() {
    const trimmed = editTitle.trim()
    if (!trimmed) return
    onEdit(show.id, { title: trimmed, notes: editNotes.trim() || undefined })
    setEditing(false)
  }

  function cancelEdit() {
    setEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') saveEdit()
    if (e.key === 'Escape') cancelEdit()
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

  return (
    <div className={`show-card status-${show.status}`}>
      <div className="show-main">
        <span className="show-title">{show.title}</span>
        {show.notes && <span className="show-notes">{show.notes}</span>}
      </div>
      <div className="show-controls">
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
