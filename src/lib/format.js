const dateFmt = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

export function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(`${iso}T00:00:00Z`)
  return Number.isNaN(d.getTime()) ? iso : dateFmt.format(d)
}

export function youTubeEmbedUrl(url) {
  const m = /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|live\/)|youtu\.be\/)([\w-]{6,})/.exec(url || '')
  return m ? `https://www.youtube.com/embed/${m[1]}` : null
}

const TYPE_LABELS = {
  pdf: 'PDF',
  video: 'Video',
  youtube: 'YouTube',
  md: 'Markdown',
}

export function materialTypeLabel(type) {
  return TYPE_LABELS[type] || (type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Resource')
}
