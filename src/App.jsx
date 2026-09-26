import { useEffect, useState } from 'react'
import { getCourse } from './lib/data.js'
import CatalogPage from './components/CatalogPage.jsx'
import CoursePage from './components/CoursePage.jsx'
import { CompassIcon } from './components/icons.jsx'

function currentRoute() {
  const hash = window.location.hash || '#/'
  const courseMatch = hash.match(/^#\/course\/([\w-]+)\/?$/)
  if (courseMatch) return { name: 'course', courseId: courseMatch[1] }
  return { name: 'catalog' }
}

export default function App() {
  const [route, setRoute] = useState(currentRoute)

  useEffect(() => {
    const onHashChange = () => {
      setRoute(currentRoute())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const course = route.name === 'course' ? getCourse(route.courseId) : null

  return (
    <div className={`app ${route.name === 'course' && course ? 'app--course' : ''}`}>
      <header className="site-header">
        <a className="brand" href="#/" aria-label="Clio home">
          <span className="brand__mark">
            <CompassIcon size={22} />
          </span>
          <span className="brand__text">
            Clio <span className="brand__sub">· history online</span>
          </span>
        </a>
        <nav className="site-nav" aria-label="Main">
          <a
            className={`site-nav__link ${route.name === 'catalog' ? 'is-current' : ''}`}
            href="#/"
            aria-current={route.name === 'catalog' ? 'page' : undefined}
          >
            Catalog
          </a>
        </nav>
      </header>

      {route.name === 'catalog' && (
        <CatalogPage onOpenCourse={(courseId) => { window.location.hash = `#/course/${courseId}` }} />
      )}

      {route.name === 'course' && course && (
        <CoursePage
          key={course.id}
          course={course}
          onBack={() => { window.location.hash = '#/' }}
        />
      )}

      {route.name === 'course' && !course && (
        <main className="not-found">
          <h1>Course not found</h1>
          <p>We could not find that course in the catalog.</p>
          <a className="btn btn--primary" href="#/">Back to catalog</a>
        </main>
      )}

      {!(route.name === 'course' && course) && (
        <footer className="site-footer">
          <p>Clio · an online learning platform dedicated entirely to history.</p>
          <p className="site-footer__note">Course imagery via Wikimedia Commons. All course data from the platform catalog.</p>
        </footer>
      )}
    </div>
  )
}
