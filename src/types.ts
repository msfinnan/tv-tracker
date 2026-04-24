export type WatchStatus = 'unwatched' | 'watching' | 'watched'

export interface Episode {
  id: string
  number: number
  title: string
  watched: boolean
}

export interface Season {
  id: string
  number: number
  episodes: Episode[]
}

export interface Show {
  id: string
  title: string
  priority: number // 1 = highest
  status: WatchStatus
  notes?: string
  seasons?: Season[]
  addedAt: number
}

export interface Platform {
  id: string
  name: string
  shows: Show[]
}
