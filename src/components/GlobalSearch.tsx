interface Props {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function GlobalSearch({ searchQuery, onSearchChange }: Props) {
  return (
    <div className="global-search">
      <input
        type="text"
        className="global-search-input"
        placeholder="Search all shows..."
        value={searchQuery}
        onChange={e => onSearchChange(e.target.value)}
      />
      {searchQuery && (
        <button
          className="global-search-clear"
          onClick={() => onSearchChange('')}
          title="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  )
}
