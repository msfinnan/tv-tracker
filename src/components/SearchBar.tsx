import { useRef } from 'react'

interface Props {
  value: string
  onChange: (value: string) => void
}

/**
 * Search input component for filtering shows by title or notes content.
 * Includes a clear button when the search field has a value.
 */
export function SearchBar({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="search-bar">
      <span className="search-icon">🔍</span>
      <input
        ref={inputRef}
        type="text"
        className="search-input"
        placeholder="Search shows…"
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-label="Search shows"
      />
      {value && (
        <button
          className="search-clear"
          onClick={() => { onChange(''); inputRef.current?.focus() }}
          title="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  )
}
