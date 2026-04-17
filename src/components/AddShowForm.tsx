import { useState } from 'react'
import type { Show } from '../types'

interface Props {
  onAdd: (show: Omit<Show, 'id' | 'addedAt'>) => void
  onCancel: () => void
}

export function AddShowForm({ onAdd, onCancel }: Props) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState(3)
  const [notes, setNotes] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onAdd({ title: title.trim(), priority, status: 'unwatched', notes: notes.trim() || undefined })
    setTitle('')
    setPriority(3)
    setNotes('')
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
