import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ShowCard } from '../components/ShowCard'
import type { Show } from '../types'

const baseShow: Show = {
  id: 'show-1',
  title: 'Breaking Bad',
  priority: 2,
  status: 'unwatched',
  notes: 'Great show',
  addedAt: 1000,
}

function renderCard(overrides: Partial<Show> = {}, handlers = {}) {
  const props = {
    show: { ...baseShow, ...overrides },
    onStatusChange: vi.fn(),
    onPriorityChange: vi.fn(),
    onDelete: vi.fn(),
    onEdit: vi.fn(),
    onEpisodeChange: vi.fn(),
    ...handlers,
  }
  render(<ShowCard {...props} />)
  return props
}

describe('ShowCard', () => {
  it('renders show title and notes', () => {
    renderCard()
    expect(screen.getByText('Breaking Bad')).toBeInTheDocument()
    expect(screen.getByText('Great show')).toBeInTheDocument()
  })

  it('does not render notes span when notes is undefined', () => {
    renderCard({ notes: undefined })
    expect(screen.getByText('Breaking Bad')).toBeInTheDocument()
    expect(screen.queryByClassName?.('show-notes')).not.toBeDefined
  })

  it('displays current priority in the select', () => {
    renderCard({ priority: 4 })
    const select = screen.getByTitle('Priority') as HTMLSelectElement
    expect(select.value).toBe('4')
  })

  it('calls onStatusChange when status button is clicked', async () => {
    const props = renderCard({ status: 'unwatched' })
    const btn = screen.getByTitle('Cycle status')
    await userEvent.click(btn)
    expect(props.onStatusChange).toHaveBeenCalledWith('show-1', 'watching')
  })

  it('cycles status: watching -> watched', async () => {
    const props = renderCard({ status: 'watching' })
    const btn = screen.getByTitle('Cycle status')
    await userEvent.click(btn)
    expect(props.onStatusChange).toHaveBeenCalledWith('show-1', 'watched')
  })

  it('cycles status: watched -> unwatched', async () => {
    const props = renderCard({ status: 'watched' })
    const btn = screen.getByTitle('Cycle status')
    await userEvent.click(btn)
    expect(props.onStatusChange).toHaveBeenCalledWith('show-1', 'unwatched')
  })

  it('calls onPriorityChange when priority is changed', async () => {
    const props = renderCard()
    const select = screen.getByTitle('Priority')
    await userEvent.selectOptions(select, '5')
    expect(props.onPriorityChange).toHaveBeenCalledWith('show-1', 5)
  })

  it('calls onDelete when delete button is clicked', async () => {
    const props = renderCard()
    const btn = screen.getByTitle('Remove')
    await userEvent.click(btn)
    expect(props.onDelete).toHaveBeenCalledWith('show-1')
  })

  describe('editing', () => {
    it('enters edit mode when edit button is clicked', async () => {
      renderCard()
      const editBtn = screen.getByTitle('Edit')
      await userEvent.click(editBtn)

      expect(screen.getByPlaceholderText('Show title')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Notes (optional)')).toBeInTheDocument()
    })

    it('saves edit on Save button click', async () => {
      const props = renderCard()
      await userEvent.click(screen.getByTitle('Edit'))

      const titleInput = screen.getByPlaceholderText('Show title') as HTMLInputElement
      await userEvent.clear(titleInput)
      await userEvent.type(titleInput, 'Better Call Saul')

      await userEvent.click(screen.getByText('Save'))
      expect(props.onEdit).toHaveBeenCalledWith('show-1', {
        title: 'Better Call Saul',
        notes: 'Great show',
      })
    })

    it('saves edit on Enter key', async () => {
      const props = renderCard()
      await userEvent.click(screen.getByTitle('Edit'))

      const titleInput = screen.getByPlaceholderText('Show title')
      await userEvent.clear(titleInput)
      await userEvent.type(titleInput, 'The Wire{Enter}')

      expect(props.onEdit).toHaveBeenCalledWith('show-1', {
        title: 'The Wire',
        notes: 'Great show',
      })
    })

    it('cancels edit on Cancel button click', async () => {
      const props = renderCard()
      await userEvent.click(screen.getByTitle('Edit'))
      await userEvent.click(screen.getByText('Cancel'))

      expect(screen.getByText('Breaking Bad')).toBeInTheDocument()
      expect(props.onEdit).not.toHaveBeenCalled()
    })

    it('cancels edit on Escape key', async () => {
      const props = renderCard()
      await userEvent.click(screen.getByTitle('Edit'))

      const titleInput = screen.getByPlaceholderText('Show title')
      await userEvent.type(titleInput, '{Escape}')

      expect(screen.getByText('Breaking Bad')).toBeInTheDocument()
      expect(props.onEdit).not.toHaveBeenCalled()
    })

    it('does not save if title is empty', async () => {
      const props = renderCard()
      await userEvent.click(screen.getByTitle('Edit'))

      const titleInput = screen.getByPlaceholderText('Show title')
      await userEvent.clear(titleInput)
      await userEvent.click(screen.getByText('Save'))

      // Should remain in edit mode, onEdit not called
      expect(props.onEdit).not.toHaveBeenCalled()
      expect(screen.getByPlaceholderText('Show title')).toBeInTheDocument()
    })
  })
})
