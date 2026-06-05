export function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function formatProgress(season?: number, episode?: number): string | null {
  if (!season && !episode) return null
  const s = season ? `S${season}` : ''
  const e = episode ? `E${episode}` : ''
  return `${s}${s && e ? ' ' : ''}${e}`
}

export function downloadJson(data: unknown, filename: string): void {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
