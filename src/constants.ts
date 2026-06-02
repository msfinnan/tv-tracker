import type { WatchStatus, Priority } from './types'

export const STATUS_LABELS: Record<WatchStatus, string> = {
  unwatched: '⬜ Unwatched',
  watching: '▶️ Watching',
  watched: '✅ Watched',
}

export const STATUS_CYCLE: Record<WatchStatus, WatchStatus> = {
  unwatched: 'watching',
  watching: 'watched',
  watched: 'unwatched',
}

export const PRIORITY_OPTIONS = [
  { value: 1, label: '1 — Must watch' },
  { value: 2, label: '2 — High' },
  { value: 3, label: '3 — Medium' },
  { value: 4, label: '4 — Low' },
  { value: 5, label: '5 — Someday' },
] as const

export const DEFAULT_PRIORITY: Priority = 3
