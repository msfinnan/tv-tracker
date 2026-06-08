import type { Platform } from './types'
import { isValidPlatform } from './validation'

const KEY = 'tv-tracker-platforms'

const DEFAULTS: Platform[] = [
  { id: 'netflix', name: 'Netflix', shows: [] },
  { id: 'hulu', name: 'Hulu', shows: [] },
  { id: 'hbo', name: 'HBO Max', shows: [] },
  { id: 'disney', name: 'Disney+', shows: [] },
  { id: 'apple', name: 'Apple TV+', shows: [] },
  { id: 'prime', name: 'Prime Video', shows: [] },
  { id: 'peacock', name: 'Peacock', shows: [] },
]

export function loadPlatforms(): Platform[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULTS
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed) || !parsed.every(isValidPlatform)) return DEFAULTS
    return parsed as Platform[]
  } catch {
    return DEFAULTS
  }
}

export function savePlatforms(platforms: Platform[]): void {
  localStorage.setItem(KEY, JSON.stringify(platforms))
}
