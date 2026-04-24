import { useState } from 'react'
import type { Show, WatchStatus } from '../types'
import { EpisodeTracker } from './EpisodeTracker'

interface Props {
  show: Show
  onStatusChange: (id: string, status: WatchStatus) => void
  onPriorityChange: (id: string, priority: number) => void
  onUpdateShow: (id: string, patch: Partial<Show>) => void
  onDelete: (id: string) => void
}

const STATUS_LABELS: Record<WatchStatus, string> = {
  unwatched: '⬜ Unwatched',
  watching: '▶️ Watching',
  watched: '✅ Watched',
}

const STATUS_CYCLE: Record<WatchStatus, WatchStatus> = {
  unwatched: 'watching',
  watching: 'watched',
  watched: 'unwatched',
}

export function ShowCard({ show, onStatusChange, onPriorityChange, onUpdateShow, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false)

  const seasons = show.seasons ?? []
  const totalEpisodes = seasons.reduce((sum, s) => sum + s.episodes.length, 0)
  const watchedEpisodes = seasons.reduce((sum, s) => sum + s.episodes.filter(e => e.watched).length, 0)
  const hasEpisodes = totalEpisodes > 0
  const hasSeasons = seasons.length > 0

  return (
    <div className={`show-card status-${show.status}`}>
      <div className="show-card-top">
        <div className="show-main">
          <div className="show-title-row">
            {hasSeasons && (
              <button
                className={`expand-btn${expanded ? ' expanded' : ''}`}
                onClick={() => setExpanded(!expanded)}
                title={expanded ? 'Collapse' : 'Expand'}
              >
                ▸
              </button>
            )}
            <span className="show-title">{show.title}</span>
            {hasEpisodes && (
              <span className="episode-progress">{watchedEpisodes}/{totalEpisodes} ep</span>
            )}
          </div>
          {show.notes && <span className="show-notes">{show.notes}</span>}
        </div>
        <div className="show-controls">
          <select
            className="priority-select"
            value={show.priority}
            title="Priority"
            onChange={e => onPriorityChange(show.id, Number(e.target.value))}
          >
            <option value={1}>P1</option>
            <option value={2}>P2</option>
            <option value={3}>P3</option>
            <option value={4}>P4</option>
            <option value={5}>P5</option>
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
      {expanded && hasSeasons && (
        <EpisodeTracker
          seasons={seasons}
          onSeasonsChange={newSeasons => onUpdateShow(show.id, { seasons: newSeasons })}
        />
      )}
    </div>
  )
}
