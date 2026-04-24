interface Props {
  value: string
  onChange: (query: string) => void
  onClear: () => void
}

export function SearchBar({ value, onChange, onClear }: Props) {
  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder="Search shows across all platforms..."
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {value && (
        <button className="search-clear" onClick={onClear} title="Clear search">
          ✕
        </button>
      )}
    </div>
  )
}
