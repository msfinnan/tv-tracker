import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddShowForm } from '../components/AddShowForm'

describe('AddShowForm', () => {
  it('renders all form inputs', () => {
    render(<AddShowForm onAdd={vi.fn()} onCancel={vi.fn()} />)

    expect(screen.getByPlaceholderText('Show title')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Notes (optional)')).toBeInTheDocument()
    expect(screen.getByText('Add')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('calls onAdd with correct data when form is submitted', async () => {
    const onAdd = vi.fn()
    render(<AddShowForm onAdd={onAdd} onCancel={vi.fn()} />)

    await userEvent.type(screen.getByPlaceholderText('Show title'), 'Stranger Things')
    await userEvent.selectOptions(screen.getByRole('combobox'), '2')
    await userEvent.type(screen.getByPlaceholderText('Notes (optional)'), 'Sci-fi horror')

    await userEvent.click(screen.getByText('Add'))

    expect(onAdd).toHaveBeenCalledWith({
      title: 'Stranger Things',
      priority: 2,
      status: 'unwatched',
      notes: 'Sci-fi horror',
    })
  })

  it('defaults to priority 3', () => {
    render(<AddShowForm onAdd={vi.fn()} onCancel={vi.fn()} />)
    const select = screen.getByRole('combobox') as HTMLSelectElement
    expect(select.value).toBe('3')
  })

  it('does not call onAdd if title is empty', async () => {
    const onAdd = vi.fn()
    render(<AddShowForm onAdd={onAdd} onCancel={vi.fn()} />)

    await userEvent.click(screen.getByText('Add'))
    expect(onAdd).not.toHaveBeenCalled()
  })

  it('trims whitespace from title and notes', async () => {
    const onAdd = vi.fn()
    render(<AddShowForm onAdd={onAdd} onCancel={vi.fn()} />)

    await userEvent.type(screen.getByPlaceholderText('Show title'), '  The Office  ')
    await userEvent.type(screen.getByPlaceholderText('Notes (optional)'), '  Comedy  ')
    await userEvent.click(screen.getByText('Add'))

    expect(onAdd).toHaveBeenCalledWith({
      title: 'The Office',
      priority: 3,
      status: 'unwatched',
      notes: 'Comedy',
    })
  })

  it('sets notes to undefined when notes is only whitespace', async () => {
    const onAdd = vi.fn()
    render(<AddShowForm onAdd={onAdd} onCancel={vi.fn()} />)

    await userEvent.type(screen.getByPlaceholderText('Show title'), 'Test Show')
    await userEvent.type(screen.getByPlaceholderText('Notes (optional)'), '   ')
    await userEvent.click(screen.getByText('Add'))

    expect(onAdd).toHaveBeenCalledWith({
      title: 'Test Show',
      priority: 3,
      status: 'unwatched',
      notes: undefined,
    })
  })

  it('calls onCancel when Cancel button is clicked', async () => {
    const onCancel = vi.fn()
    render(<AddShowForm onAdd={vi.fn()} onCancel={onCancel} />)

    await userEvent.click(screen.getByText('Cancel'))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('resets form fields after successful submission', async () => {
    const onAdd = vi.fn()
    render(<AddShowForm onAdd={onAdd} onCancel={vi.fn()} />)

    const titleInput = screen.getByPlaceholderText('Show title') as HTMLInputElement
    const notesInput = screen.getByPlaceholderText('Notes (optional)') as HTMLInputElement

    await userEvent.type(titleInput, 'Test')
    await userEvent.type(notesInput, 'Note')
    await userEvent.click(screen.getByText('Add'))

    expect(titleInput.value).toBe('')
    expect(notesInput.value).toBe('')
  })
})
