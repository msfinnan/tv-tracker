import { useState } from 'react'
import type { Show, Priority } from '../types'
import { DEFAULT_PRIORITY, PRIORITY_OPTIONS } from '../constants'

interface Props {
  onAdd: (show: Omit<Show, 'id' | 'addedAt'>) => void
  onCancel: () => void
}

export function AddShowForm({ onAdd, onCancel }: Props) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState(DEFAULT_PRIORITY)
  const [notes, setNotes] = useState('')
  const [season, setSeason] = useState('')
  const [episode, setEpisode] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onAdd({
      title: title.trim(),
      priority,
      status: 'unwatched',
      notes: notes.trim() || undefined,
      season: season ? Number(season) : undefined,
      episode: episode ? Number(episode) : undefined,
    })
    setTitle('')
    setPriority(DEFAULT_PRIORITY)
    setNotes('')
    setSeason('')
    setEpisode('')
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
          <select value={priority} onChange={e => setPriority(Number(e.target.value) as Priority)}>
            {PRIORITY_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="form-row">
        <label>
          Season
          <input
            type="number"
            min={1}
            className="episode-input"
            placeholder="S"
            value={season}
            onChange={e => setSeason(e.target.value)}
          />
        </label>
        <label>
          Episode
          <input
            type="number"
            min={1}
            className="episode-input"
            placeholder="E"
            value={episode}
            onChange={e => setEpisode(e.target.value)}
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
