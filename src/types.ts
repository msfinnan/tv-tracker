/** Represents the watch progress status of a show */
export type WatchStatus = 'unwatched' | 'watching' | 'watched'

/** Constrained priority value from 1 (highest) to 5 (lowest) */
export type Priority = 1 | 2 | 3 | 4 | 5

/** Represents a TV show being tracked */
export interface Show {
  /** Unique identifier for the show */
  id: string
  /** Display title of the show */
  title: string
  /** Priority level from 1 (must watch) to 5 (someday) */
  priority: Priority
  /** Current watch status */
  status: WatchStatus
  /** Optional user notes about the show */
  notes?: string
  /** Current season number being watched */
  season?: number
  /** Current episode number being watched */
  episode?: number
  /** Timestamp (ms) when the show was added */
  addedAt: number
}

/** Represents a streaming platform containing tracked shows */
export interface Platform {
  /** Unique identifier for the platform */
  id: string
  /** Display name of the platform */
  name: string
  /** List of shows tracked on this platform */
  shows: Show[]
}

/** Data required to create a new show (without auto-generated fields) */
export type NewShow = Omit<Show, 'id' | 'addedAt'>
