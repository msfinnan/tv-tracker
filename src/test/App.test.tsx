import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the app header', () => {
    render(<App />)
    expect(screen.getByText(/TV Tracker/)).toBeInTheDocument()
  })

  it('renders default platform tabs', () => {
    render(<App />)
    expect(screen.getByText('Netflix')).toBeInTheDocument()
    expect(screen.getByText('Hulu')).toBeInTheDocument()
    expect(screen.getByText('HBO Max')).toBeInTheDocument()
    expect(screen.getByText('Disney+')).toBeInTheDocument()
    expect(screen.getByText('Apple TV+')).toBeInTheDocument()
    expect(screen.getByText('Prime Video')).toBeInTheDocument()
    expect(screen.getByText('Peacock')).toBeInTheDocument()
  })


  it('shows empty state message initially', () => {
    render(<App />)
    expect(screen.getByText('No shows here yet.')).toBeInTheDocument()
  })

  it('can add a show to the active platform', async () => {
    render(<App />)

    await userEvent.click(screen.getByText('+ Add Show'))
    await userEvent.type(screen.getByPlaceholderText('Show title'), 'Stranger Things')
    await userEvent.click(screen.getByText('Add'))

    expect(screen.getByText('Stranger Things')).toBeInTheDocument()
    expect(screen.queryByText('No shows here yet.')).not.toBeInTheDocument()
  })

  it('can switch platforms and see separate show lists', async () => {
    render(<App />)

    // Add a show to Netflix (first/default tab)
    await userEvent.click(screen.getByText('+ Add Show'))
    await userEvent.type(screen.getByPlaceholderText('Show title'), 'Squid Game')
    await userEvent.click(screen.getByText('Add'))

    expect(screen.getByText('Squid Game')).toBeInTheDocument()

    // Switch to Hulu
    await userEvent.click(screen.getByText('Hulu'))
    expect(screen.queryByText('Squid Game')).not.toBeInTheDocument()
    expect(screen.getByText('No shows here yet.')).toBeInTheDocument()
  })


  it('can delete a show', async () => {
    render(<App />)

    await userEvent.click(screen.getByText('+ Add Show'))
    await userEvent.type(screen.getByPlaceholderText('Show title'), 'Test Show')
    await userEvent.click(screen.getByText('Add'))

    expect(screen.getByText('Test Show')).toBeInTheDocument()

    await userEvent.click(screen.getByTitle('Remove'))
    expect(screen.queryByText('Test Show')).not.toBeInTheDocument()
  })

  it('can cycle show status', async () => {
    render(<App />)

    await userEvent.click(screen.getByText('+ Add Show'))
    await userEvent.type(screen.getByPlaceholderText('Show title'), 'My Show')
    await userEvent.click(screen.getByText('Add'))

    // Initial status: unwatched
    const statusBtn = screen.getByTitle('Cycle status')
    expect(statusBtn).toHaveTextContent('Unwatched')

    // Click to cycle: unwatched -> watching
    await userEvent.click(statusBtn)
    expect(screen.getByTitle('Cycle status')).toHaveTextContent('Watching')

    // Click to cycle: watching -> watched
    await userEvent.click(screen.getByTitle('Cycle status'))
    expect(screen.getByTitle('Cycle status')).toHaveTextContent('Watched')
  })


  it('persists shows to localStorage', async () => {
    render(<App />)

    await userEvent.click(screen.getByText('+ Add Show'))
    await userEvent.type(screen.getByPlaceholderText('Show title'), 'Persisted Show')
    await userEvent.click(screen.getByText('Add'))

    const stored = JSON.parse(localStorage.getItem('tv-tracker-platforms')!)
    const netflix = stored.find((p: { id: string }) => p.id === 'netflix')
    expect(netflix.shows).toHaveLength(1)
    expect(netflix.shows[0].title).toBe('Persisted Show')
  })

  it('does not show stats dashboard when no shows exist', () => {
    render(<App />)
    expect(screen.queryByText('Total Shows')).not.toBeInTheDocument()
  })

  it('shows stats dashboard after adding a show', async () => {
    render(<App />)

    await userEvent.click(screen.getByText('+ Add Show'))
    await userEvent.type(screen.getByPlaceholderText('Show title'), 'Stats Show')
    await userEvent.click(screen.getByText('Add'))

    expect(screen.getByText('Total Shows')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })
})
