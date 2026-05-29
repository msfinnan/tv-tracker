import { useState, useRef, useEffect } from 'react'
import type { Show } from '../types'

interface Props {
  show: Show
  onSave: (patch: { title: string; notes?: string; season?: number; episode?: number }) => void
  onCancel: () => void
}

export function ShowCardEditForm({ show, onSave, onCancel }: Props) {
  const [editTitle, setEditTitle] = useState(show.title)
  const [editNotes, setEditNotes] = useState(show.notes ?? '')
  const [editSeason, setEditSeason] = useState(show.season?.toString() ?? '')
  const [editEpisode, setEditEpisode] = useState(show.episode?.toString() ?? '')
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  function saveEdit() {
    const trimmed = editTitle.trim()
    if (!trimmed) return
    onSave({
      title: trimmed,
      notes: editNotes.trim() || undefined,
      season: editSeason ? Number(editSeason) : undefined,
      episode: editEpisode ? Number(editEpisode) : undefined,
    })
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') saveEdit()
    if (e.key === 'Escape') onCancel()
  }

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
          <button className="edit-cancel-btn" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
