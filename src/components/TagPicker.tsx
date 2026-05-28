import { GENRE_TAGS } from '../types'

interface Props {
  selected: string[]
  onChange: (tags: string[]) => void
}

export function TagPicker({ selected, onChange }: Props) {
  function toggle(tag: string) {
    if (selected.includes(tag)) {
      onChange(selected.filter(t => t !== tag))
    } else {
      onChange([...selected, tag])
    }
  }

  return (
    <div className="tag-picker">
      {GENRE_TAGS.map(tag => (
        <button
          key={tag}
          type="button"
          className={`tag-chip ${selected.includes(tag) ? 'tag-selected' : ''}`}
          onClick={() => toggle(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}
