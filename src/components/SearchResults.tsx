import type { Platform, WatchStatus } from '../types'
import { ShowCard } from './ShowCard'

interface Props {
  platforms: Platform[]
  query: string
  onStatusChange: (platformId: string, showId: string, status: WatchStatus) => void
  onPriorityChange: (platformId: string, showId: string, priority: number) => void
  onDeleteShow: (platformId: string, showId: string) => void
  onEditShow: (platformId: string, showId: string, patch: { title: string; notes?: string }) => void
}

export function SearchResults({ platforms, query, onStatusChange, onPriorityChange, onDeleteShow, onEditShow }: Props) {
  const lowerQuery = query.toLowerCase()

  const results = platforms.flatMap(platform =>
    platform.shows
      .filter(show =>
        show.title.toLowerCase().includes(lowerQuery) ||
        (show.notes && show.notes.toLowerCase().includes(lowerQuery))
      )
      .map(show => ({ show, platform }))
  )

  if (results.length === 0) {
    return (
      <div className="search-results">
        <p className="empty">No shows match "{query}"</p>
      </div>
    )
  }

  return (
    <div className="search-results">
      <p className="search-results-count">{results.length} result{results.length !== 1 ? 's' : ''} found</p>
      {results.map(({ show, platform }) => (
        <div key={`${platform.id}-${show.id}`} className="search-result-item">
          <span className="search-result-platform-label">{platform.name}</span>
          <ShowCard
            show={show}
            onStatusChange={(id, status) => onStatusChange(platform.id, id, status)}
            onPriorityChange={(id, priority) => onPriorityChange(platform.id, id, priority)}
            onDelete={id => onDeleteShow(platform.id, id)}
            onEdit={(id, patch) => onEditShow(platform.id, id, patch)}
          />
        </div>
      ))}
    </div>
  )
}
