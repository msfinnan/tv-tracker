import type { Show, WatchStatus } from '../types'

interface Props {
  show: Show
  onStatusChange: (id: string, status: WatchStatus) => void
  onPriorityChange: (id: string, priority: number) => void
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

export function ShowCard({ show, onStatusChange, onPriorityChange, onDelete }: Props) {
  return (
    <div className={`show-card status-${show.status}`}>
      <div className="show-main">
        <span className="show-title">{show.title}</span>
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
  )
}
