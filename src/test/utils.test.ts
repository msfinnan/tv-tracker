import { describe, it, expect, vi } from 'vitest'
import { generateId, formatProgress, downloadJson } from '../utils'

describe('generateId', () => {
  it('returns a non-empty string', () => {
    const id = generateId()
    expect(id).toBeTruthy()
    expect(typeof id).toBe('string')
  })

  it('returns unique values across multiple calls', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()))
    expect(ids.size).toBe(100)
  })
})

describe('formatProgress', () => {
  it('returns null when both season and episode are undefined', () => {
    expect(formatProgress(undefined, undefined)).toBeNull()
  })

  it('returns "S2" when only season is provided', () => {
    expect(formatProgress(2, undefined)).toBe('S2')
  })

  it('returns "E5" when only episode is provided', () => {
    expect(formatProgress(undefined, 5)).toBe('E5')
  })

  it('returns "S3 E7" when both season and episode are provided', () => {
    expect(formatProgress(3, 7)).toBe('S3 E7')
  })
})

describe('downloadJson', () => {
  it('creates a blob URL, assigns to anchor, clicks, and revokes', () => {
    const mockUrl = 'blob:http://localhost/fake-url'
    const mockAnchor = {
      href: '',
      download: '',
      click: vi.fn(),
    }

    vi.spyOn(URL, 'createObjectURL').mockReturnValue(mockUrl)
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as unknown as HTMLElement)

    const data = { hello: 'world' }
    downloadJson(data, 'test.json')

    expect(document.createElement).toHaveBeenCalledWith('a')
    expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob))
    expect(mockAnchor.href).toBe(mockUrl)
    expect(mockAnchor.download).toBe('test.json')
    expect(mockAnchor.click).toHaveBeenCalled()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith(mockUrl)

    vi.restoreAllMocks()
  })
})
