import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PlatformTabs } from '../components/PlatformTabs'
import type { Platform } from '../types'

const platforms: Platform[] = [
  { id: 'netflix', name: 'Netflix', shows: [{ id: 's1', title: 'Show', priority: 1, status: 'unwatched', addedAt: 1 }] },
  { id: 'hulu', name: 'Hulu', shows: [] },
  { id: 'hbo', name: 'HBO Max', shows: [] },
]

describe('PlatformTabs', () => {
  it('renders a tab for each platform', () => {
    render(
      <PlatformTabs
        platforms={platforms}
        active="netflix"
        onSelect={vi.fn()}
        onAddPlatform={vi.fn()}
      />
    )

    expect(screen.getByText('Netflix')).toBeInTheDocument()
    expect(screen.getByText('Hulu')).toBeInTheDocument()
    expect(screen.getByText('HBO Max')).toBeInTheDocument()
  })

  it('shows show count in each tab', () => {
    render(
      <PlatformTabs
        platforms={platforms}
        active="netflix"
        onSelect={vi.fn()}
        onAddPlatform={vi.fn()}
      />
    )

    expect(screen.getByText('1')).toBeInTheDocument()
    // Hulu and HBO have 0 shows
    expect(screen.getAllByText('0')).toHaveLength(2)
  })

  it('marks the active tab with active class', () => {
    render(
      <PlatformTabs
        platforms={platforms}
        active="netflix"
        onSelect={vi.fn()}
        onAddPlatform={vi.fn()}
      />
    )

    const netflixBtn = screen.getByText('Netflix').closest('button')
    expect(netflixBtn).toHaveClass('active')

    const huluBtn = screen.getByText('Hulu').closest('button')
    expect(huluBtn).not.toHaveClass('active')
  })

  it('calls onSelect when a tab is clicked', async () => {
    const onSelect = vi.fn()
    render(
      <PlatformTabs
        platforms={platforms}
        active="netflix"
        onSelect={onSelect}
        onAddPlatform={vi.fn()}
      />
    )

    await userEvent.click(screen.getByText('Hulu').closest('button')!)
    expect(onSelect).toHaveBeenCalledWith('hulu')
  })

  it('calls onAddPlatform when add button is clicked and user provides name', async () => {
    const onAddPlatform = vi.fn()
    const promptSpy = vi.spyOn(window, 'prompt').mockReturnValue('Crunchyroll')

    render(
      <PlatformTabs
        platforms={platforms}
        active="netflix"
        onSelect={vi.fn()}
        onAddPlatform={onAddPlatform}
      />
    )

    await userEvent.click(screen.getByTitle('Add platform'))
    expect(promptSpy).toHaveBeenCalledWith('Platform name:')
    expect(onAddPlatform).toHaveBeenCalledWith('Crunchyroll')

    promptSpy.mockRestore()
  })

  it('does not call onAddPlatform when user cancels prompt', async () => {
    const onAddPlatform = vi.fn()
    const promptSpy = vi.spyOn(window, 'prompt').mockReturnValue(null)

    render(
      <PlatformTabs
        platforms={platforms}
        active="netflix"
        onSelect={vi.fn()}
        onAddPlatform={onAddPlatform}
      />
    )

    await userEvent.click(screen.getByTitle('Add platform'))
    expect(onAddPlatform).not.toHaveBeenCalled()

    promptSpy.mockRestore()
  })

  it('does not call onAddPlatform when user enters empty string', async () => {
    const onAddPlatform = vi.fn()
    const promptSpy = vi.spyOn(window, 'prompt').mockReturnValue('   ')

    render(
      <PlatformTabs
        platforms={platforms}
        active="netflix"
        onSelect={vi.fn()}
        onAddPlatform={onAddPlatform}
      />
    )

    await userEvent.click(screen.getByTitle('Add platform'))
    expect(onAddPlatform).not.toHaveBeenCalled()

    promptSpy.mockRestore()
  })
})
