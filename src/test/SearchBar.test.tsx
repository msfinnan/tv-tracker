import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBar } from '../components/SearchBar'

describe('SearchBar', () => {
  it('renders input with correct placeholder', () => {
    render(<SearchBar value="" onChange={vi.fn()} />)
    expect(screen.getByPlaceholderText('Search shows\u2026')).toBeInTheDocument()
  })

  it('displays the provided value in the input', () => {
    render(<SearchBar value="Breaking Bad" onChange={vi.fn()} />)
    const input = screen.getByPlaceholderText('Search shows\u2026') as HTMLInputElement
    expect(input.value).toBe('Breaking Bad')
  })

  it('calls onChange when user types in the input', async () => {
    const onChange = vi.fn()
    render(<SearchBar value="" onChange={onChange} />)
    const input = screen.getByPlaceholderText('Search shows\u2026')
    await userEvent.type(input, 'a')
    expect(onChange).toHaveBeenCalledWith('a')
  })

  it('shows clear button when value is non-empty', () => {
    render(<SearchBar value="test" onChange={vi.fn()} />)
    expect(screen.getByTitle('Clear search')).toBeInTheDocument()
  })

  it('does not show clear button when value is empty', () => {
    render(<SearchBar value="" onChange={vi.fn()} />)
    expect(screen.queryByTitle('Clear search')).not.toBeInTheDocument()
  })

  it('clicking clear button calls onChange with empty string', async () => {
    const onChange = vi.fn()
    render(<SearchBar value="test" onChange={onChange} />)
    await userEvent.click(screen.getByTitle('Clear search'))
    expect(onChange).toHaveBeenCalledWith('')
  })
})
