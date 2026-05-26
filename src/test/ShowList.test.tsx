import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ShowList } from '../components/ShowList'
import type { Platform } from '../types'

const platform: Platform = {
  id: 'netflix',
  name: 'Netflix',
  shows: [
    { id: 's1', title: 'Zebra Show', priority: 3, status: 'unwatched', addedAt: 1000 },
    { id: 's2', title: 'Alpha Show', priority: 1, status: 'watching', addedAt: 2000 },
    { id: 's3', title: 'Beta Show', priority: 5, status: 'watched', addedAt: 500 },
  ],
}

function renderShowList(platformOverride?: Partial<Platform>) {
  const props = {
    platform: { ...platform, ...platformOverride },
    onAddShow: vi.fn(),
    onStatusChange: vi.fn(),
    onPriorityChange: vi.fn(),
    onDeleteShow: vi.fn(),
    onEditShow: vi.fn(),
  }
  render(<ShowList {...props} />)
  return props
}

describe('ShowList', () => {
  it('renders all shows', () => {
    renderShowList()
    expect(screen.getByText('Zebra Show')).toBeInTheDocument()
    expect(screen.getByText('Alpha Show')).toBeInTheDocument()
    expect(screen.getByText('Beta Show')).toBeInTheDocument()
  })

  it('shows empty message when no shows exist', () => {
    renderShowList({ shows: [] })
    expect(screen.getByText('No shows here yet.')).toBeInTheDocument()
  })

  it('sorts by priority by default (lowest number first)', () => {
    renderShowList()
    const cards = screen.getAllByText(/Show$/)
    // Priority order: Alpha (1), Zebra (3), Beta (5)
    expect(cards[0]).toHaveTextContent('Alpha Show')
    expect(cards[1]).toHaveTextContent('Zebra Show')
    expect(cards[2]).toHaveTextContent('Beta Show')
  })

  it('sorts by title when title sort is selected', async () => {
    renderShowList()
    const sortSelect = screen.getAllByRole('combobox')[0]
    await userEvent.selectOptions(sortSelect, 'title')

    const cards = screen.getAllByText(/Show$/)
    expect(cards[0]).toHaveTextContent('Alpha Show')
    expect(cards[1]).toHaveTextContent('Beta Show')
    expect(cards[2]).toHaveTextContent('Zebra Show')
  })

  it('sorts by date added when added sort is selected', async () => {
    renderShowList()
    const sortSelect = screen.getAllByRole('combobox')[0]
    await userEvent.selectOptions(sortSelect, 'added')

    const cards = screen.getAllByText(/Show$/)
    // addedAt order: Beta (500), Zebra (1000), Alpha (2000)
    expect(cards[0]).toHaveTextContent('Beta Show')
    expect(cards[1]).toHaveTextContent('Zebra Show')
    expect(cards[2]).toHaveTextContent('Alpha Show')
  })

  it('filters by watch status', async () => {
    renderShowList()
    const filterSelect = screen.getAllByRole('combobox')[1]
    await userEvent.selectOptions(filterSelect, 'watching')

    expect(screen.getByText('Alpha Show')).toBeInTheDocument()
    expect(screen.queryByText('Zebra Show')).not.toBeInTheDocument()
    expect(screen.queryByText('Beta Show')).not.toBeInTheDocument()
  })

  it('shows add form when + Add Show is clicked', async () => {
    renderShowList()
    await userEvent.click(screen.getByText('+ Add Show'))
    expect(screen.getByPlaceholderText('Show title')).toBeInTheDocument()
  })

  it('hides add form and calls onAddShow when form is submitted', async () => {
    const props = renderShowList()
    await userEvent.click(screen.getByText('+ Add Show'))
    await userEvent.type(screen.getByPlaceholderText('Show title'), 'New Show')
    await userEvent.click(screen.getByText('Add'))

    expect(props.onAddShow).toHaveBeenCalledWith('netflix', expect.objectContaining({
      title: 'New Show',
      priority: 3,
      status: 'unwatched',
    }))
  })
})
