import { describe, it, expect, beforeEach } from 'vitest'
import { loadPlatforms, savePlatforms } from '../storage'
import type { Platform } from '../types'

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('loadPlatforms', () => {
    it('returns default platforms when localStorage is empty', () => {
      const platforms = loadPlatforms()
      expect(platforms).toHaveLength(7)
      expect(platforms[0]).toEqual({ id: 'netflix', name: 'Netflix', shows: [] })
      expect(platforms[1]).toEqual({ id: 'hulu', name: 'Hulu', shows: [] })
      expect(platforms[2]).toEqual({ id: 'hbo', name: 'HBO Max', shows: [] })
      expect(platforms[3]).toEqual({ id: 'disney', name: 'Disney+', shows: [] })
      expect(platforms[4]).toEqual({ id: 'apple', name: 'Apple TV+', shows: [] })
      expect(platforms[5]).toEqual({ id: 'prime', name: 'Prime Video', shows: [] })
      expect(platforms[6]).toEqual({ id: 'peacock', name: 'Peacock', shows: [] })
    })

    it('returns saved platforms from localStorage', () => {
      const saved: Platform[] = [
        { id: 'custom', name: 'Custom', shows: [] },
      ]
      localStorage.setItem('tv-tracker-platforms', JSON.stringify(saved))

      const platforms = loadPlatforms()
      expect(platforms).toEqual(saved)
    })

    it('returns defaults if localStorage contains invalid JSON', () => {
      localStorage.setItem('tv-tracker-platforms', 'not-valid-json{{{')

      const platforms = loadPlatforms()
      expect(platforms).toHaveLength(7)
      expect(platforms[0].id).toBe('netflix')
    })
  })

  describe('savePlatforms', () => {
    it('saves platforms to localStorage', () => {
      const platforms: Platform[] = [
        {
          id: 'test',
          name: 'Test Platform',
          shows: [
            { id: 's1', title: 'Show 1', priority: 1, status: 'unwatched', addedAt: 1000 },
          ],
        },
      ]

      savePlatforms(platforms)

      const stored = localStorage.getItem('tv-tracker-platforms')
      expect(stored).not.toBeNull()
      expect(JSON.parse(stored!)).toEqual(platforms)
    })

    it('overwrites previous data', () => {
      const first: Platform[] = [{ id: 'a', name: 'A', shows: [] }]
      const second: Platform[] = [{ id: 'b', name: 'B', shows: [] }]

      savePlatforms(first)
      savePlatforms(second)

      const stored = JSON.parse(localStorage.getItem('tv-tracker-platforms')!)
      expect(stored).toEqual(second)
    })
  })
})
