import { useState } from 'react'
import type { Platform, Show, WatchStatus } from '../types'
import { GENRE_TAGS } from '../types'
import { ShowCard } from './ShowCard'
import { AddShowForm } from './AddShowForm'
import { SearchBar } from './SearchBar'

interface Props {
  platform: Platform
  onAddShow: (platformId: string, show: Omit<Show, 'id' | 'addedAt'>) => void
  onStatusChange: (platformId: string, showId: string, status: WatchStatus) => void
  onPriorityChange: (platformId: string, showId: string, priority: number) => void
  onDeleteShow: (platformId: string, showId: string) => void
  onEditShow: (platformId: string, showId: string, patch: { title: string; notes?: string; season?: number; episode?: number; tags?: string[] }) => void
  onEpisodeChange: (platformId: string, showId: string, season: number | undefined, episode: number | undefined) => void
}

type SortKey = 'priority' | 'title' | 'added'
type FilterStatus = 'all' | WatchStatus

export function ShowList({ platform, onAddShow, onStatusChange, onPriorityChange, onDeleteShow, onEditShow, onEpisodeChange }: Props) {
  const [adding, setAdding] = useState(false)
  const [sort, setSort] = useState<SortKey>('priority')
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [tagFilter, setTagFilter] = useState<string>('all')
  const [search, setSearch] = useState('')

  const searched = platform.shows.filter(s => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return s.title.toLowerCase().includes(q) || (s.notes?.toLowerCase().includes(q) ?? false)
  })

  const filtered = searched
    .filter(s => filter === 'all' || s.status === filter)
    .filter(s => tagFilter === 'all' || (s.tags?.includes(tagFilter) ?? false))

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'priority') return a.priority - b.priority
    if (sort === 'title') return a.title.localeCompare(b.title)
    return a.addedAt - b.addedAt
  })

  return (
    <div className="show-list">
      <SearchBar value={search} onChange={setSearch} />
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
          <label>Genre
            <select value={tagFilter} onChange={e => setTagFilter(e.target.value)}>
              <option value="all">All</option>
              {GENRE_TAGS.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
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
        <p className="empty">{search.trim() || tagFilter !== 'all' ? 'No shows match your filters.' : 'No shows here yet.'}</p>
      )}

      {sorted.map(show => (
        <ShowCard
          key={show.id}
          show={show}
          onStatusChange={(id, status) => onStatusChange(platform.id, id, status)}
          onPriorityChange={(id, priority) => onPriorityChange(platform.id, id, priority)}
          onDelete={id => onDeleteShow(platform.id, id)}
          onEdit={(id, patch) => onEditShow(platform.id, id, patch)}
          onEpisodeChange={(id, season, episode) => onEpisodeChange(platform.id, id, season, episode)}
        />
      ))}
    </div>
  )
}
