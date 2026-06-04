export type WatchStatus = 'unwatched' | 'watching' | 'watched'

export const GENRE_TAGS = [
  'Drama',
  'Comedy',
  'Sci-Fi',
  'Fantasy',
  'Thriller',
  'Horror',
  'Action',
  'Romance',
  'Documentary',
  'Animation',
  'Crime',
  'Mystery',
] as const

export type GenreTag = typeof GENRE_TAGS[number]

export interface Show {
  id: string
  title: string
  priority: number // 1 = highest
  status: WatchStatus
  notes?: string
  season?: number
  episode?: number
  tags?: string[]
  addedAt: number
}

export interface Platform {
  id: string
  name: string
  shows: Show[]
}
