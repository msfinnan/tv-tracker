import { useState } from 'react'
import type { Show, WatchStatus } from '../types'
import { STATUS_LABELS, STATUS_CYCLE, PRIORITY_OPTIONS } from '../constants'
import { formatProgress } from '../utils'
import { ShowCardEditForm } from './ShowCardEditForm'

interface Props {
  show: Show
  onStatusChange: (id: string, status: WatchStatus) => void
  onPriorityChange: (id: string, priority: number) => void
  onDelete: (id: string) => void
  onEdit: (id: string, patch: { title: string; notes?: string; season?: number; episode?: number }) => void
  onEpisodeChange: (id: string, season: number | undefined, episode: number | undefined) => void
}

export function ShowCard({ show, onStatusChange, onPriorityChange, onDelete, onEdit, onEpisodeChange }: Props) {
  const [editing, setEditing] = useState(false)

  function startEdit() {
    setEditing(true)
  }

  function handleSave(patch: { title: string; notes?: string; season?: number; episode?: number }) {
    onEdit(show.id, patch)
    setEditing(false)
  }

  function handleCancel() {
    setEditing(false)
  }

  function incrementEpisode() {
    const newEp = (show.episode ?? 0) + 1
    onEpisodeChange(show.id, show.season || 1, newEp)
  }

  if (editing) {
    return <ShowCardEditForm show={show} onSave={handleSave} onCancel={handleCancel} />
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
          {PRIORITY_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
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
