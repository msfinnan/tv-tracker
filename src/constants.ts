import type { WatchStatus, Priority, Platform } from './types'

/** localStorage key used to persist platform data */
export const STORAGE_KEY = 'tv-tracker-platforms'

/** Default priority value for new shows */
export const DEFAULT_PRIORITY: Priority = 3

/** Minimum allowed priority value (highest priority) */
export const PRIORITY_MIN = 1

/** Maximum allowed priority value (lowest priority) */
export const PRIORITY_MAX = 5

/** Human-readable labels for each priority level */
export const PRIORITY_LABELS: Record<number, string> = {
  1: 'Must watch',
  2: 'High',
  3: 'Medium',
  4: 'Low',
  5: 'Someday',
}

/** All valid watch statuses in order */
export const WATCH_STATUSES: WatchStatus[] = ['unwatched', 'watching', 'watched']

/** Human-readable labels for each watch status (without emoji) */
export const STATUS_LABELS: Record<WatchStatus, string> = {
  unwatched: 'Unwatched',
  watching: 'Watching',
  watched: 'Watched',
}

/** Maps each status to the next status in the cycle */
export const STATUS_CYCLE: Record<WatchStatus, WatchStatus> = {
  unwatched: 'watching',
  watching: 'watched',
  watched: 'unwatched',
}

/** Default platforms provided on first use */
export const DEFAULT_PLATFORMS: Platform[] = [
  { id: 'netflix', name: 'Netflix', shows: [] },
  { id: 'hulu', name: 'Hulu', shows: [] },
  { id: 'hbo', name: 'HBO Max', shows: [] },
  { id: 'disney', name: 'Disney+', shows: [] },
  { id: 'apple', name: 'Apple TV+', shows: [] },
  { id: 'prime', name: 'Prime Video', shows: [] },
  { id: 'peacock', name: 'Peacock', shows: [] },
]
