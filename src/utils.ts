export function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function formatProgress(season?: number, episode?: number): string | null {
  if (!season && !episode) return null
  const s = season ? `S${season}` : ''
  const e = episode ? `E${episode}` : ''
  return `${s}${s && e ? ' ' : ''}${e}`
}
