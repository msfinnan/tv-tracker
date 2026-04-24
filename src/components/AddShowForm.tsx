import { useState } from 'react'
import type { Show, Season } from '../types'

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

interface Props {
  onAdd: (show: Omit<Show, 'id' | 'addedAt'>) => void
  onCancel: () => void
}

export function AddShowForm({ onAdd, onCancel }: Props) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState(3)
  const [notes, setNotes] = useState('')
  const [seasonCount, setSeasonCount] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    const numSeasons = parseInt(seasonCount, 10)
    let seasons: Season[] | undefined
    if (numSeasons > 0) {
      seasons = Array.from({ length: numSeasons }, (_, i) => ({
        id: uid(),
        number: i + 1,
        episodes: [],
      }))
    }

    onAdd({
      title: title.trim(),
      priority,
      status: 'unwatched',
      notes: notes.trim() || undefined,
      seasons,
    })
    setTitle('')
    setPriority(3)
    setNotes('')
    setSeasonCount('')
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <input
        autoFocus
        placeholder="Show title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <div className="form-row">
        <label>
          Priority
          <select value={priority} onChange={e => setPriority(Number(e.target.value))}>
            <option value={1}>1 — Must watch</option>
            <option value={2}>2 — High</option>
            <option value={3}>3 — Medium</option>
            <option value={4}>4 — Low</option>
            <option value={5}>5 — Someday</option>
          </select>
        </label>
        <label>
          Seasons
          <input
            type="number"
            className="season-count-input"
            min={0}
            max={99}
            placeholder="0"
            value={seasonCount}
            onChange={e => setSeasonCount(e.target.value)}
          />
        </label>
      </div>
      <input
        placeholder="Notes (optional)"
        value={notes}
        onChange={e => setNotes(e.target.value)}
      />
      <div className="form-actions">
        <button type="submit">Add</button>
        <button type="button" className="secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}
