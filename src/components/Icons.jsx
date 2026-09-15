const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }

export function IconSearch(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...s} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.8-3.8" />
    </svg>
  )
}

export function IconArrowLeft(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...s} {...props}>
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  )
}

export function IconChevronLeft(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...s} {...props}>
      <path d="m14 6-6 6 6 6" />
    </svg>
  )
}

export function IconChevronRight(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...s} {...props}>
      <path d="m10 6 6 6-6 6" />
    </svg>
  )
}

export function IconClose(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...s} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export function IconCalendar(props) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" {...s} {...props}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </svg>
  )
}

export function IconStack(props) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" {...s} {...props}>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </svg>
  )
}

export function IconDoc(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...s} {...props}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </svg>
  )
}

export function IconPlay(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...s} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m10.5 9.5 4.5 2.5-4.5 2.5v-5Z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconYouTube(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...s} {...props}>
      <rect x="2.5" y="6" width="19" height="12" rx="3.5" />
      <path d="m10.5 9.5 4.5 2.5-4.5 2.5v-5Z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconMarkdown(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...s} {...props}>
      <rect x="2.5" y="6" width="19" height="12" rx="2" />
      <path d="M6 15v-6l3 3 3-3v6M16 9v4.5M16 13.5 14.2 11.7M16 13.5l1.8-1.8" />
    </svg>
  )
}

export function IconLink(props) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" {...s} {...props}>
      <path d="M10 13a4.5 4.5 0 0 0 6.7.4l2-2a4.5 4.5 0 0 0-6.4-6.4l-1.1 1.1" />
      <path d="M14 11a4.5 4.5 0 0 0-6.7-.4l-2 2a4.5 4.5 0 0 0 6.4 6.4l1.1-1.1" />
    </svg>
  )
}

export function IconImage(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...s} {...props}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="m4.5 17 4.7-4.7a2 2 0 0 1 2.8 0L20 20" />
    </svg>
  )
}

export function IconCompass(props) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" {...s} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.2 8.8-2 4.4-4.4 2 2-4.4 4.4-2Z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export const MATERIAL_ICONS = {
  pdf: IconDoc,
  video: IconPlay,
  youtube: IconYouTube,
  md: IconMarkdown,
  markdown: IconMarkdown,
}
