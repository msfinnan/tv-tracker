import type { Platform } from './types'
import { STORAGE_KEY, DEFAULT_PLATFORMS } from './constants'

export function loadPlatforms(): Platform[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Platform[]) : DEFAULT_PLATFORMS
  } catch {
    return DEFAULT_PLATFORMS
  }
}

export function savePlatforms(platforms: Platform[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(platforms))
}
