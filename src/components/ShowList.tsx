import { useState } from 'react'
import type { Platform, Show, WatchStatus } from '../types'
import { ShowCard } from './ShowCard'
import { AddShowForm } from './AddShowForm'

interface Props {
  platform: Platform
  onAddShow: (platformId: string, show: Omit<Show, 'id' | 'addedAt'>) => void
  onStatusChange: (platformId: string, showId: string, status: WatchStatus) => void
  onPriorityChange: (platformId: string, showId: string, priority: number) => void
  onUpdateShow: (platformId: string, showId: string, patch: Partial<Show>) => void
  onDeleteShow: (platformId: string, showId: string) => void
}

type SortKey = 'priority' | 'title' | 'added'
type FilterStatus = 'all' | WatchStatus

export function ShowList({ platform, onAddShow, onStatusChange, onPriorityChange, onUpdateShow, onDeleteShow }: Props) {
  const [adding, setAdding] = useState(false)
  const [sort, setSort] = useState<SortKey>('priority')
  const [filter, setFilter] = useState<FilterStatus>('all')

  const filtered = platform.shows.filter(s => filter === 'all' || s.status === filter)

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'priority') return a.priority - b.priority
    if (sort === 'title') return a.title.localeCompare(b.title)
    return a.addedAt - b.addedAt
  })

  return (
    <div className="show-list">
      <div className="list-toolbar">
        <div className="toolbar-group">
          <label>Sort
            <select value={sort} onChange={e => setSort(e.target.value as SortKey)}>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
              <option value="added">Date Added</option>
            </select>
          </label>
          <label>Filter
            <select value={filter} onChange={e => setFilter(e.target.value as FilterStatus)}>
              <option value="all">All</option>
              <option value="unwatched">Unwatched</option>
              <option value="watching">Watching</option>
              <option value="watched">Watched</option>
            </select>
          </label>
        </div>
        <button className="add-btn" onClick={() => setAdding(true)}>+ Add Show</button>
      </div>

      {adding && (
        <AddShowForm
          onAdd={show => { onAddShow(platform.id, show); setAdding(false) }}
          onCancel={() => setAdding(false)}
        />
      )}

      {sorted.length === 0 && !adding && (
        <p className="empty">No shows here yet.</p>
      )}

      {sorted.map(show => (
        <ShowCard
          key={show.id}
          show={show}
          onStatusChange={(id, status) => onStatusChange(platform.id, id, status)}
          onPriorityChange={(id, priority) => onPriorityChange(platform.id, id, priority)}
          onUpdateShow={(id, patch) => onUpdateShow(platform.id, id, patch)}
          onDelete={id => onDeleteShow(platform.id, id)}
        />
      ))}
    </div>
  )
}
