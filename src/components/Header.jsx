import { IconCompass } from './Icons.jsx'

export default function Header({ courseCount, instructorCount }) {
  return (
    <header className="site-header">
      <a className="brand" href="#/">
        <span className="brand-mark" aria-hidden="true">
          <IconCompass />
        </span>
        <span className="brand-text">
          <span className="brand-name">Clio</span>
          <span className="brand-tag">Online History School</span>
        </span>
      </a>
      <p className="header-stats">
        <span>{courseCount} courses</span>
        <span className="header-dot" aria-hidden="true">·</span>
        <span>{instructorCount} instructors</span>
      </p>
    </header>
  )
}
