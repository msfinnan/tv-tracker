import type { Platform, Show, WatchStatus } from '../types'
import { ShowCard } from './ShowCard'

interface Props {
  platforms: Platform[]
  query: string
  onStatusChange: (platformId: string, showId: string, status: WatchStatus) => void
  onPriorityChange: (platformId: string, showId: string, priority: number) => void
  onUpdateShow: (platformId: string, showId: string, patch: Partial<Show>) => void
  onDeleteShow: (platformId: string, showId: string) => void
  onGoToPlatform: (platformId: string) => void
}

export function SearchResults({
  platforms,
  query,
  onStatusChange,
  onPriorityChange,
  onUpdateShow,
  onDeleteShow,
  onGoToPlatform,
}: Props) {
  const lowerQuery = query.toLowerCase()

  const groups = platforms
    .map(p => ({
      platform: p,
      matches: p.shows.filter(s => s.title.toLowerCase().includes(lowerQuery)),
    }))
    .filter(g => g.matches.length > 0)

  const totalMatches = groups.reduce((sum, g) => sum + g.matches.length, 0)

  return (
    <div className="search-results">
      {totalMatches === 0 ? (
        <p className="search-empty">No shows found</p>
      ) : (
        groups.map(({ platform, matches }) => (
          <div key={platform.id}>
            <div
              className="search-platform-header"
              onClick={() => onGoToPlatform(platform.id)}
            >
              {platform.name} ({matches.length})
            </div>
            {matches.map(show => (
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
        ))
      )}
    </div>
  )
}
