import { useState } from 'react'
import type { Platform, Show } from '../types'

interface Props {
  platforms: Platform[]
}

interface Pick {
  show: Show
  platformName: string
}

export function Randomizer({ platforms }: Props) {
  const [pick, setPick] = useState<Pick | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const unwatched = platforms.flatMap(p =>
    p.shows
      .filter(s => s.status === 'unwatched')
      .map(s => ({ show: s, platformName: p.name }))
  )

  function rollPick() {
    if (unwatched.length === 0) return
    const idx = Math.floor(Math.random() * unwatched.length)
    setPick(unwatched[idx])
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
    setPick(null)
  }

  if (unwatched.length === 0) return null

  return (
    <>
      <button className="randomizer-btn" onClick={rollPick} title="Pick a random show to watch">
        🎲 Surprise me
      </button>

      {isOpen && pick && (
        <div className="randomizer-overlay" onClick={close}>
          <div className="randomizer-modal" onClick={e => e.stopPropagation()}>
            <div className="randomizer-header">🎲 You should watch...</div>
            <div className="randomizer-pick">
              <span className="randomizer-title">{pick.show.title}</span>
              <span className="randomizer-platform">{pick.platformName}</span>
              {pick.show.tags && pick.show.tags.length > 0 && (
                <div className="randomizer-tags">
                  {pick.show.tags.map(tag => (
                    <span key={tag} className="tag-badge">{tag}</span>
                  ))}
                </div>
              )}
              {pick.show.notes && (
                <span className="randomizer-notes">{pick.show.notes}</span>
              )}
            </div>
            <div className="randomizer-actions">
              <button className="randomizer-reroll" onClick={rollPick}>🎲 Pick again</button>
              <button className="randomizer-close" onClick={close}>Got it</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
