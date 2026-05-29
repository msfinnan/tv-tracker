import type { WatchStatus, Platform } from './types'

export const WATCH_STATUSES = {
  unwatched: 'unwatched',
  watching: 'watching',
  watched: 'watched',
} as const

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

export const PRIORITY_OPTIONS: { value: number; label: string }[] = [
  { value: 1, label: '1 — Must watch' },
  { value: 2, label: '2 — High' },
  { value: 3, label: '3 — Medium' },
  { value: 4, label: '4 — Low' },
  { value: 5, label: '5 — Someday' },
]

export const DEFAULT_PLATFORMS: Platform[] = [
  { id: 'netflix', name: 'Netflix', shows: [] },
  { id: 'hulu', name: 'Hulu', shows: [] },
  { id: 'hbo', name: 'HBO Max', shows: [] },
  { id: 'disney', name: 'Disney+', shows: [] },
  { id: 'apple', name: 'Apple TV+', shows: [] },
  { id: 'prime', name: 'Prime Video', shows: [] },
  { id: 'peacock', name: 'Peacock', shows: [] },
]

export const STORAGE_KEY = 'tv-tracker-platforms'
