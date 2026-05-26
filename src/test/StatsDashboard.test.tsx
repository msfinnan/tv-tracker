import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatsDashboard } from '../components/StatsDashboard'
import type { Platform } from '../types'

describe('StatsDashboard', () => {
  it('renders nothing when there are no shows', () => {
    const { container } = render(
      <StatsDashboard platforms={[{ id: 'a', name: 'A', shows: [] }]} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('displays correct aggregate counts', () => {
    const platforms: Platform[] = [
      {
        id: 'netflix',
        name: 'Netflix',
        shows: [
          { id: 's1', title: 'Show 1', priority: 1, status: 'unwatched', addedAt: 1 },
          { id: 's2', title: 'Show 2', priority: 2, status: 'watching', addedAt: 2 },
        ],
      },
      {
        id: 'hulu',
        name: 'Hulu',
        shows: [
          { id: 's3', title: 'Show 3', priority: 1, status: 'watched', addedAt: 3 },
          { id: 's4', title: 'Show 4', priority: 3, status: 'watched', addedAt: 4 },
          { id: 's5', title: 'Show 5', priority: 2, status: 'unwatched', addedAt: 5 },
        ],
      },
    ]

    render(<StatsDashboard platforms={platforms} />)

    // Total: 5, Unwatched: 2, Watching: 1, Watched: 2, Complete: 40%
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument() // unwatched count
    expect(screen.getByText('1')).toBeInTheDocument() // watching count
    expect(screen.getByText('40%')).toBeInTheDocument()
    expect(screen.getByText('Total Shows')).toBeInTheDocument()
    expect(screen.getByText('Unwatched')).toBeInTheDocument()
    expect(screen.getByText('Watching')).toBeInTheDocument()
    expect(screen.getByText('Watched')).toBeInTheDocument()
    expect(screen.getByText('Complete')).toBeInTheDocument()
  })

  it('shows platform bar chart when multiple platforms have shows', () => {
    const platforms: Platform[] = [
      {
        id: 'netflix',
        name: 'Netflix',
        shows: [
          { id: 's1', title: 'Show 1', priority: 1, status: 'unwatched', addedAt: 1 },
          { id: 's2', title: 'Show 2', priority: 2, status: 'watching', addedAt: 2 },
        ],
      },
      {
        id: 'hulu',
        name: 'Hulu',
        shows: [
          { id: 's3', title: 'Show 3', priority: 1, status: 'watched', addedAt: 3 },
        ],
      },
    ]

    render(<StatsDashboard platforms={platforms} />)

    expect(screen.getByText('Netflix')).toBeInTheDocument()
    expect(screen.getByText('Hulu')).toBeInTheDocument()
  })

  it('does not show platform chart when only one platform has shows', () => {
    const platforms: Platform[] = [
      {
        id: 'netflix',
        name: 'Netflix',
        shows: [{ id: 's1', title: 'Show 1', priority: 1, status: 'unwatched', addedAt: 1 }],
      },
      { id: 'hulu', name: 'Hulu', shows: [] },
    ]

    render(<StatsDashboard platforms={platforms} />)

    // Stats row should exist but no platform bars section
    expect(screen.getByText('Total Shows')).toBeInTheDocument()
    expect(screen.queryByText('Netflix')).not.toBeInTheDocument()
  })
})
