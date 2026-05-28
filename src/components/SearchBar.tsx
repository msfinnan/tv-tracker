import { useRef } from 'react'

interface Props {
  value: string
  onChange: (value: string) => void
}

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
