import { useEffect, useMemo, useState } from 'react'
import { catalog } from './data/catalog.js'
import Header from './components/Header.jsx'
import CatalogPage from './components/CatalogPage.jsx'
import CoursePage from './components/CoursePage.jsx'

function parseHash(hash) {
  const m = /^#\/courses\/([\w-]+)\/?$/i.exec(hash || '')
  if (m) return { page: 'course', courseId: m[1].toUpperCase() }
  return { page: 'catalog' }
}

function useHashRoute() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash))
  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash))
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}

export default function App() {
  const route = useHashRoute()
  const course = route.page === 'course' ? catalog.getCourse(route.courseId) : null

  useEffect(() => {
    document.title = course ? `${course.name} · Clio` : 'Clio · Online History School'
    window.scrollTo(0, 0)
  }, [course])

  const stats = useMemo(
    () => ({
      courseCount: catalog.courses.length,
      instructorCount: catalog.instructors.length,
    }),
    []
  )

  return (
    <div className={route.page === 'course' && course ? 'app app-course' : 'app'}>
      <Header {...stats} />
      {route.page === 'course' ? (
        course ? (
          <CoursePage key={course.course_id} course={course} />
        ) : (
          <main className="page-missing">
            <h1>Course not found</h1>
            <p>The course you are looking for is not in the catalog.</p>
            <a className="btn btn-accent" href="#/">Back to all courses</a>
          </main>
        )
      ) : (
        <CatalogPage courses={catalog.courses} instructors={catalog.instructors} />
      )}
    </div>
  )
}
