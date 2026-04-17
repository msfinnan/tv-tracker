export type WatchStatus = 'unwatched' | 'watching' | 'watched'

export interface Show {
  id: string
  title: string
  priority: number // 1 = highest
  status: WatchStatus
  notes?: string
  addedAt: number
}

export interface Platform {
  id: string
  name: string
  shows: Show[]
}
