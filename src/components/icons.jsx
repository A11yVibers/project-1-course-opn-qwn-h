const svgProps = {
  viewBox: '0 0 24 24',
  width: 20,
  height: 20,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
  focusable: 'false',
}

export function IconCompass(props) {
  return (
    <svg {...svgProps} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.8 8.2 13.4 13.4 8.2 15.8 10.6 10.6Z" />
      <circle cx="12" cy="12" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconSearch(props) {
  return (
    <svg {...svgProps} {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  )
}

export function IconClose(props) {
  return (
    <svg {...svgProps} {...props}>
      <path d="M6 6 18 18M18 6 6 18" />
    </svg>
  )
}

export function IconArrowLeft(props) {
  return (
    <svg {...svgProps} {...props}>
      <path d="M19 12H5m7 7-7-7 7-7" />
    </svg>
  )
}

export function IconExternal(props) {
  return (
    <svg {...svgProps} {...props}>
      <path d="M14 4h6v6M20 4l-8.5 8.5" />
      <path d="M18 14.5V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V8a1.5 1.5 0 0 1 1.5-1.5H10" />
    </svg>
  )
}

export function IconCalendar(props) {
  return (
    <svg {...svgProps} {...props}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.4" />
      <path d="M8 3v4m8-4v4M3.5 10h17" />
    </svg>
  )
}

export function IconClock(props) {
  return (
    <svg {...svgProps} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5.2l3.2 2" />
    </svg>
  )
}

export function IconPanelCollapse(props) {
  return (
    <svg {...svgProps} {...props}>
      <path d="m11.5 6-6 6 6 6M18.5 6l-6 6 6 6" />
    </svg>
  )
}

export function IconPanelExpand(props) {
  return (
    <svg {...svgProps} {...props}>
      <path d="m12.5 6 6 6-6 6M5.5 6l6 6-6 6" />
    </svg>
  )
}

export function IconDocument(props) {
  return (
    <svg {...svgProps} {...props}>
      <path d="M7 3.5h6.5L18 8v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z" />
      <path d="M13.5 3.5V8H18" />
      <path d="M9 13h6M9 16.5h6" />
    </svg>
  )
}

export function IconVideo(props) {
  return (
    <svg {...svgProps} {...props}>
      <rect x="3" y="6" width="12.5" height="12" rx="2.2" />
      <path d="m15.5 10.5 5.5-3v9l-5.5-3z" />
    </svg>
  )
}

export function IconMarkdown(props) {
  return (
    <svg {...svgProps} {...props}>
      <rect x="2.8" y="5.5" width="18.4" height="13" rx="2.2" />
      <path d="M6.4 15V9.2l2.9 3.1 2.9-3.1V15" />
      <path d="M16 9.2v4.3m-2-1.9 2 2.1 2-2.1" />
    </svg>
  )
}

export function IconYouTube(props) {
  return (
    <svg {...svgProps} {...props}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.2 9.2v5.6l5-2.8z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconDownload(props) {
  return (
    <svg {...svgProps} {...props}>
      <path d="M12 4v10m-4-3.8 4 4 4-4M5 19.5h14" />
    </svg>
  )
}

export function IconLayers(props) {
  return (
    <svg {...svgProps} {...props}>
      <path d="m12 3.5 8.5 4.3L12 12 3.5 7.8Z" />
      <path d="m4.8 12 7.2 3.6L19.2 12M4.8 16.2 12 19.8l7.2-3.6" />
    </svg>
  )
}

export function IconQuill(props) {
  return (
    <svg {...svgProps} {...props}>
      <path d="M4 20c6.5.5 12-2.2 14.4-7.2C20.3 8.7 20.4 5.9 20 3.6c-2.6 1.7-6.7 3-9.6 5.6C7.6 11.7 7 15 4 20Z" />
      <path d="M4 20 10.5 13.5" />
    </svg>
  )
}

const TYPE_ICONS = {
  document: IconDocument,
  video: IconVideo,
  markdown: IconMarkdown,
  youtube: IconYouTube,
}

export function MaterialTypeIcon({ icon, ...props }) {
  const Component = TYPE_ICONS[icon] || IconDocument
  return <Component {...props} />
}
