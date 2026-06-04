import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ImportExport } from '../components/ImportExport'
import type { Platform } from '../types'

declare const global: typeof globalThis

const platforms: Platform[] = [
  {
    id: 'netflix',
    name: 'Netflix',
    shows: [
      { id: 's1', title: 'Show 1', priority: 1, status: 'unwatched', addedAt: 1000 },
    ],
  },
]


describe('ImportExport', () => {
  it('renders export and import buttons', () => {
    render(<ImportExport platforms={platforms} onImport={vi.fn()} />)
    expect(screen.getByText(/Export/)).toBeInTheDocument()
    expect(screen.getByText(/Import/)).toBeInTheDocument()
  })

  it('renders import mode select with merge and replace options', () => {
    render(<ImportExport platforms={platforms} onImport={vi.fn()} />)
    const select = screen.getByTitle('Choose how to handle imported data') as HTMLSelectElement
    expect(select.value).toBe('merge')
    expect(screen.getByText('Merge')).toBeInTheDocument()
    expect(screen.getByText('Replace')).toBeInTheDocument()
  })


  it('calls export and creates download link', async () => {
    const createObjectURL = vi.fn(() => 'blob:test')
    const revokeObjectURL = vi.fn()
    global.URL.createObjectURL = createObjectURL
    global.URL.revokeObjectURL = revokeObjectURL

    const clickMock = vi.fn()
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'a') {
        return { click: clickMock, href: '', download: '' } as unknown as HTMLElement
      }
      return document.createElement(tag)
    })

    render(<ImportExport platforms={platforms} onImport={vi.fn()} />)
    await userEvent.click(screen.getByText(/Export/))

    expect(createObjectURL).toHaveBeenCalled()
    expect(clickMock).toHaveBeenCalled()
    expect(revokeObjectURL).toHaveBeenCalled()

    vi.restoreAllMocks()
  })


  it('shows success message after export', async () => {
    global.URL.createObjectURL = vi.fn(() => 'blob:test')
    global.URL.revokeObjectURL = vi.fn()

    render(<ImportExport platforms={platforms} onImport={vi.fn()} />)
    await userEvent.click(screen.getByText(/Export/))

    expect(screen.getByText('Watchlist exported successfully!')).toBeInTheDocument()

    vi.restoreAllMocks()
  })

  it('shows error message for invalid import data', async () => {
    const onImport = vi.fn()
    render(<ImportExport platforms={platforms} onImport={onImport} />)

    const invalidData = JSON.stringify({ not: 'valid' })
    const file = new File([invalidData], 'test.json', { type: 'application/json' })

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    await userEvent.upload(input, file)

    expect(await screen.findByText(/Invalid file format/)).toBeInTheDocument()
    expect(onImport).not.toHaveBeenCalled()
  })


  it('imports valid data in replace mode', async () => {
    const onImport = vi.fn()
    render(<ImportExport platforms={platforms} onImport={onImport} />)

    // Switch to replace mode
    const modeSelect = screen.getByTitle('Choose how to handle imported data')
    await userEvent.selectOptions(modeSelect, 'replace')

    const importData: Platform[] = [
      { id: 'hulu', name: 'Hulu', shows: [] },
    ]
    const file = new File([JSON.stringify(importData)], 'test.json', { type: 'application/json' })

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    await userEvent.upload(input, file)

    expect(await screen.findByText(/Imported 1 platform/)).toBeInTheDocument()
    expect(onImport).toHaveBeenCalledWith(importData)
  })

  it('imports valid data in merge mode', async () => {
    const onImport = vi.fn()
    render(<ImportExport platforms={platforms} onImport={onImport} />)

    const importData: Platform[] = [
      {
        id: 'netflix',
        name: 'Netflix',
        shows: [
          { id: 's2', title: 'Show 2', priority: 2, status: 'watched', addedAt: 2000 },
        ],
      },
    ]
    const file = new File([JSON.stringify(importData)], 'test.json', { type: 'application/json' })

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    await userEvent.upload(input, file)

    expect(await screen.findByText(/Merged successfully/)).toBeInTheDocument()
    expect(onImport).toHaveBeenCalled()
  })


  it('dismisses message when dismiss button is clicked', async () => {
    global.URL.createObjectURL = vi.fn(() => 'blob:test')
    global.URL.revokeObjectURL = vi.fn()

    render(<ImportExport platforms={platforms} onImport={vi.fn()} />)
    await userEvent.click(screen.getByText(/Export/))

    expect(screen.getByText('Watchlist exported successfully!')).toBeInTheDocument()
    await userEvent.click(screen.getByText('✕'))
    expect(screen.queryByText('Watchlist exported successfully!')).not.toBeInTheDocument()

    vi.restoreAllMocks()
  })
})
