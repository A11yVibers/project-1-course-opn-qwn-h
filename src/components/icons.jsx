const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function Svg({ size = 20, children, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...rest}>
      {children}
    </svg>
  )
}

export function PdfIcon({ size }) {
  return (
    <Svg size={size} {...base}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h1.5a1.25 1.25 0 0 1 0 2.5H9V13v4" />
      <path d="M14.5 13v4.5" />
    </Svg>
  )
}

export function VideoIcon({ size }) {
  return (
    <Svg size={size} {...base}>
      <rect x="3" y="5" width="14" height="14" rx="2" />
      <path d="m17 10 4-2.5v9L17 14z" />
      <path d="m9.5 9.5 4 2.5-4 2.5z" />
    </Svg>
  )
}

export function YouTubeIcon({ size }) {
  return (
    <Svg size={size} {...base}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
      <path d="m10.5 9.5 5 2.5-5 2.5z" />
    </Svg>
  )
}

export function MarkdownIcon({ size }) {
  return (
    <Svg size={size} {...base}>
      <rect x="2.5" y="6" width="19" height="12" rx="2" />
      <path d="M6 15v-6l3 3 3-3v6" />
      <path d="M16.5 9v4.5" />
      <path d="m14.5 11.5 2 2 2-2" />
    </Svg>
  )
}

export function SlidesIcon({ size }) {
  return (
    <Svg size={size} {...base}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M12 16v4" />
      <path d="M8 20h8" />
      <path d="M7 10l3-2 2.5 2L16 7" />
    </Svg>
  )
}

export function LinkIcon({ size }) {
  return (
    <Svg size={size} {...base}>
      <path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1 1" />
      <path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1-1" />
    </Svg>
  )
}

export function SearchIcon({ size }) {
  return (
    <Svg size={size} {...base}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.8-3.8" />
    </Svg>
  )
}

export function ChevronLeftIcon({ size }) {
  return (
    <Svg size={size} {...base}>
      <path d="m14.5 5-7 7 7 7" />
    </Svg>
  )
}

export function ChevronRightIcon({ size }) {
  return (
    <Svg size={size} {...base}>
      <path d="m9.5 5 7 7-7 7" />
    </Svg>
  )
}

export function ChevronDownIcon({ size }) {
  return (
    <Svg size={size} {...base}>
      <path d="m5 9 7 7 7-7" />
    </Svg>
  )
}

export function CloseIcon({ size }) {
  return (
    <Svg size={size} {...base}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Svg>
  )
}

export function CalendarIcon({ size }) {
  return (
    <Svg size={size} {...base}>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 10h17" />
      <path d="M8 3v4M16 3v4" />
    </Svg>
  )
}

export function ClockIcon({ size }) {
  return (
    <Svg size={size} {...base}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </Svg>
  )
}

export function BookIcon({ size }) {
  return (
    <Svg size={size} {...base}>
      <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" />
      <path d="M4 19a2 2 0 0 1 2-2h13" />
    </Svg>
  )
}

export function MailIcon({ size }) {
  return (
    <Svg size={size} {...base}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </Svg>
  )
}

export function CompassIcon({ size }) {
  return (
    <Svg size={size} {...base}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5z" />
    </Svg>
  )
}

export function ExternalIcon({ size }) {
  return (
    <Svg size={size} {...base}>
      <path d="M14 4h6v6" />
      <path d="M20 4 11 13" />
      <path d="M18 14.5V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V8a1.5 1.5 0 0 1 1.5-1.5H10" />
    </Svg>
  )
}

export function PanelIcon({ size }) {
  return (
    <Svg size={size} {...base}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <path d="M10 4.5v15" />
    </Svg>
  )
}

export const MATERIAL_ICONS = {
  pdf: PdfIcon,
  video: VideoIcon,
  youtube: YouTubeIcon,
  md: MarkdownIcon,
  slides: SlidesIcon,
  link: LinkIcon,
}
