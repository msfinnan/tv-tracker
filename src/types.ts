export type WatchStatus = 'unwatched' | 'watching' | 'watched'

export type Priority = 1 | 2 | 3 | 4 | 5

export interface Show {
  id: string
  title: string
  priority: Priority
  status: WatchStatus
  notes?: string
  season?: number
  episode?: number
  addedAt: number
}

export interface Platform {
  id: string
  name: string
  shows: Show[]
}

export interface ShowPatch {
  title: string
  notes?: string
  season?: number
  episode?: number
}
