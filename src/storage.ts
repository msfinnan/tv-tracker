import type { Platform } from './types'
import { STORAGE_KEY, DEFAULT_PLATFORMS } from './constants'

/**
 * Loads the saved platforms from localStorage.
 * Returns the default platforms if no data is found or if the stored data is invalid.
 */
export function loadPlatforms(): Platform[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_PLATFORMS
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return DEFAULT_PLATFORMS
    return parsed as Platform[]
  } catch {
    return DEFAULT_PLATFORMS
  }
}

/**
 * Persists the given platforms array to localStorage.
 * Returns true on success, false if storage quota is exceeded or another error occurs.
 */
export function savePlatforms(platforms: Platform[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(platforms))
    return true
  } catch (error) {
    console.error('Failed to save platforms to localStorage:', error)
    return false
  }
}
