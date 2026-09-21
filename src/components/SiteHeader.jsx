import { IconCompass } from './icons.jsx'

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="brand" href="#/">
          <span className="brand__mark" aria-hidden="true">
            <IconCompass width={22} height={22} />
          </span>
          <span className="brand__text">
            <span className="brand__name">Chronicle Academy</span>
            <span className="brand__tag">Online history courses</span>
          </span>
        </a>
        <nav className="site-nav" aria-label="Main">
          <a className="site-nav__link" href="#/">
            Course catalog
          </a>
        </nav>
      </div>
    </header>
  )
}

export function SiteFooter({ platform }) {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p>
          <strong>Chronicle Academy</strong> — a digital school of world history.
        </p>
        <p className="site-footer__meta">
          {platform.totals.courses} courses · {platform.totals.classes} classes · {platform.totals.instructors}{' '}
          instructors{platform.term ? ` · ${platform.term} term` : ''}
        </p>
      </div>
    </footer>
  )
}
