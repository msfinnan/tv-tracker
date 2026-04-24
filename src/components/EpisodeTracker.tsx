import { useState } from 'react'
import type { Season, Episode } from '../types'

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

interface Props {
  seasons: Season[]
  onSeasonsChange: (seasons: Season[]) => void
}

export function EpisodeTracker({ seasons, onSeasonsChange }: Props) {
  const [newEpTitle, setNewEpTitle] = useState<Record<string, string>>({})
  const [addingEpisode, setAddingEpisode] = useState<string | null>(null)

  function toggleEpisode(seasonId: string, episodeId: string) {
    onSeasonsChange(
      seasons.map(s =>
        s.id === seasonId
          ? {
              ...s,
              episodes: s.episodes.map(ep =>
                ep.id === episodeId ? { ...ep, watched: !ep.watched } : ep
              ),
            }
          : s
      )
    )
  }

  function updateEpisodeTitle(seasonId: string, episodeId: string, title: string) {
    onSeasonsChange(
      seasons.map(s =>
        s.id === seasonId
          ? {
              ...s,
              episodes: s.episodes.map(ep =>
                ep.id === episodeId ? { ...ep, title } : ep
              ),
            }
          : s
      )
    )
  }

  function addEpisode(seasonId: string) {
    const season = seasons.find(s => s.id === seasonId)
    if (!season) return
    const nextNum = season.episodes.length > 0
      ? Math.max(...season.episodes.map(e => e.number)) + 1
      : 1
    const title = (newEpTitle[seasonId] ?? '').trim()
    const episode: Episode = { id: uid(), number: nextNum, title, watched: false }
    onSeasonsChange(
      seasons.map(s =>
        s.id === seasonId ? { ...s, episodes: [...s.episodes, episode] } : s
      )
    )
    setNewEpTitle(prev => ({ ...prev, [seasonId]: '' }))
    setAddingEpisode(null)
  }

  function addSeason() {
    const nextNum = seasons.length > 0
      ? Math.max(...seasons.map(s => s.number)) + 1
      : 1
    onSeasonsChange([...seasons, { id: uid(), number: nextNum, episodes: [] }])
  }

  return (
    <div className="episode-tracker">
      {seasons.map(season => {
        const watched = season.episodes.filter(e => e.watched).length
        const total = season.episodes.length
        return (
          <div key={season.id} className="season-block">
            <div className="season-header">
              <span>Season {season.number}</span>
              <span className="episode-progress">{watched}/{total} watched</span>
            </div>
            <div className="season-episodes">
              {season.episodes.map(ep => (
                <div key={ep.id} className="episode-row">
                  <input
                    type="checkbox"
                    className="episode-checkbox"
                    checked={ep.watched}
                    onChange={() => toggleEpisode(season.id, ep.id)}
                  />
                  <span className="episode-number">E{ep.number}</span>
                  <input
                    type="text"
                    className="episode-title-input"
                    value={ep.title}
                    placeholder="Episode title"
                    onChange={e => updateEpisodeTitle(season.id, ep.id, e.target.value)}
                  />
                </div>
              ))}
              {addingEpisode === season.id ? (
                <div className="episode-row add-episode-row">
                  <input
                    autoFocus
                    type="text"
                    className="episode-title-input"
                    placeholder="Episode title (optional)"
                    value={newEpTitle[season.id] ?? ''}
                    onChange={e => setNewEpTitle(prev => ({ ...prev, [season.id]: e.target.value }))}
                    onKeyDown={e => {
                      if (e.key === 'Enter') addEpisode(season.id)
                      if (e.key === 'Escape') setAddingEpisode(null)
                    }}
                  />
                  <button className="add-episode-btn" onClick={() => addEpisode(season.id)}>Add</button>
                  <button className="secondary add-episode-btn" onClick={() => setAddingEpisode(null)}>Cancel</button>
                </div>
              ) : (
                <button className="add-episode-btn" onClick={() => setAddingEpisode(season.id)}>+ Episode</button>
              )}
            </div>
          </div>
        )
      })}
      <button className="add-season-btn" onClick={addSeason}>+ Add Season</button>
    </div>
  )
}
