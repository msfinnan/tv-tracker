import type { Platform, Show, WatchStatus } from './types'

const VALID_STATUSES: WatchStatus[] = ['unwatched', 'watching', 'watched']

export function isValidShow(s: unknown): s is Show {
  if (typeof s !== 'object' || s === null) return false
  const obj = s as Record<string, unknown>
  return (
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.priority === 'number' &&
    VALID_STATUSES.includes(obj.status as WatchStatus) &&
    typeof obj.addedAt === 'number'
  )
}

export function isValidPlatform(p: unknown): p is Platform {
  if (typeof p !== 'object' || p === null) return false
  const obj = p as Record<string, unknown>
  return (
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    Array.isArray(obj.shows) &&
    (obj.shows as unknown[]).every(isValidShow)
  )
}

export function validateImportData(data: unknown): Platform[] | null {
  if (!Array.isArray(data)) return null
  if (!data.every(isValidPlatform)) return null
  return data as Platform[]
}
