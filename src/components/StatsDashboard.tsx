import type { Platform } from '../types'

interface Props {
  platforms: Platform[]
}

/**
 * Displays aggregate statistics about tracked shows across all platforms,
 * including counts by status, completion percentage, and per-platform breakdown.
 */
export function StatsDashboard({ platforms }: Props) {
  const allShows = platforms.flatMap(p => p.shows)
  const total = allShows.length

  if (total === 0) return null

  const counts = allShows.reduce((acc, show) => {
    acc[show.status] = (acc[show.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  const unwatched = counts.unwatched || 0
  const watching = counts.watching || 0
  const watched = counts.watched || 0
  const completionPct = Math.round((watched / total) * 100)

  // Top platforms by show count (only those with shows)
  const platformStats = platforms
    .filter(p => p.shows.length > 0)
    .map(p => ({ name: p.name, count: p.shows.length }))
    .sort((a, b) => b.count - a.count)

  return (
    <div className="stats-dashboard">
      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-value">{total}</span>
          <span className="stat-label">Total Shows</span>
        </div>
        <div className="stat-card">
          <span className="stat-value stat-unwatched">{unwatched}</span>
          <span className="stat-label">Unwatched</span>
        </div>
        <div className="stat-card">
          <span className="stat-value stat-watching">{watching}</span>
          <span className="stat-label">Watching</span>
        </div>
        <div className="stat-card">
          <span className="stat-value stat-watched">{watched}</span>
          <span className="stat-label">Watched</span>
        </div>
        <div className="stat-card">
          <span className="stat-value stat-pct">{completionPct}%</span>
          <span className="stat-label">Complete</span>
        </div>
      </div>

      {platformStats.length > 1 && (
        <div className="stats-platforms">
          {platformStats.map(p => (
            <div key={p.name} className="stats-platform-bar">
              <span className="stats-platform-name">{p.name}</span>
              <div className="stats-bar-track">
                <div
                  className="stats-bar-fill"
                  style={{ width: `${(p.count / total) * 100}%` }}
                />
              </div>
              <span className="stats-platform-count">{p.count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
