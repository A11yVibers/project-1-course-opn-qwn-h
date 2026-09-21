import { useEffect, useState } from 'react'
import { PLATFORM } from './data/platform.js'
import SiteHeader, { SiteFooter } from './components/SiteHeader.jsx'
import CatalogPage from './components/CatalogPage.jsx'
import CoursePage from './components/CoursePage.jsx'
import { IconArrowLeft } from './components/icons.jsx'

function parseHash(hash) {
  const match = /^#\/course\/([A-Za-z0-9_-]+)\/?$/.exec(hash || '')
  if (match) return { view: 'course', courseId: match[1].toUpperCase() }
  return { view: 'catalog' }
}

export default function App() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash))

  useEffect(() => {
    function onHashChange() {
      setRoute(parseHash(window.location.hash))
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const course = route.view === 'course' ? PLATFORM.coursesById[route.courseId] : null

  useEffect(() => {
    document.title = course
      ? `${course.name} · Chronicle Academy`
      : 'Chronicle Academy · Online History Courses'
  }, [course])

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main">
        {route.view === 'catalog' && <CatalogPage platform={PLATFORM} />}
        {route.view === 'course' && course && <CoursePage key={course.courseId} course={course} platform={PLATFORM} />}
        {route.view === 'course' && !course && (
          <div className="not-found">
            <h1>Course not found</h1>
            <p>The course you are looking for is not in the catalog.</p>
            <a className="btn" href="#/">
              <IconArrowLeft width={16} height={16} /> Back to catalog
            </a>
          </div>
        )}
      </main>
      <SiteFooter platform={PLATFORM} />
    </>
  )
}
