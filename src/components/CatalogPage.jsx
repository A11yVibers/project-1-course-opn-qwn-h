import { useMemo, useState } from 'react'
import CourseCard from './CourseCard.jsx'
import { IconSearch, IconClose } from './Icons.jsx'

export default function CatalogPage({ courses, instructors }) {
  const [query, setQuery] = useState('')
  const [instructorId, setInstructorId] = useState('all')
  const [weekFilter, setWeekFilter] = useState('all')
  const [sort, setSort] = useState('featured')

  const weekOptions = useMemo(
    () => [...new Set(courses.map((c) => c.number_of_weeks))].sort((a, b) => a - b),
    [courses]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = courses.filter((c) => {
      if (instructorId !== 'all' && c.instructor_id !== instructorId) return false
      if (weekFilter !== 'all' && c.number_of_weeks !== Number(weekFilter)) return false
      if (q) {
        const hay = [
          c.course_id,
          c.name,
          c.short_description,
          c.long_description,
          c.instructor?.name ?? '',
        ]
          .join(' ')
          .toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
    const sorted = [...list]
    if (sort === 'title') sorted.sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'shortest') sorted.sort((a, b) => a.number_of_weeks - b.number_of_weeks || a.name.localeCompare(b.name))
    if (sort === 'longest') sorted.sort((a, b) => b.number_of_weeks - a.number_of_weeks || a.name.localeCompare(b.name))
    return sorted
  }, [courses, query, instructorId, weekFilter, sort])

  const filtersActive = query.trim() !== '' || instructorId !== 'all' || weekFilter !== 'all'
  const clearFilters = () => {
    setQuery('')
    setInstructorId('all')
    setWeekFilter('all')
  }

  return (
    <main className="catalog-page">
      <section className="hero">
        <p className="hero-kicker">Twelve courses · Five thousand years</p>
        <h1 className="hero-title">
          Study the past with <em>guided, source-rich</em> courses
        </h1>
        <p className="hero-sub">
          From the Nile to the Silk Roads — every course pairs expert instruction with a
          week-by-week syllabus, lecture materials, readings, and assignments you can open
          right in the browser.
        </p>
        <div className="search-bar" role="search">
          <IconSearch className="search-icon" />
          <input
            type="search"
            value={query}
            placeholder="Search courses, topics, or instructors…"
            aria-label="Search courses"
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button className="search-clear" type="button" aria-label="Clear search" onClick={() => setQuery('')}>
              <IconClose />
            </button>
          )}
        </div>
      </section>

      <section className="catalog-controls" aria-label="Catalog filters">
        <div className="control-group">
          <label htmlFor="filter-instructor">Instructor</label>
          <select id="filter-instructor" value={instructorId} onChange={(e) => setInstructorId(e.target.value)}>
            <option value="all">All instructors</option>
            {instructors.map((ins) => (
              <option key={ins.instructor_id} value={ins.instructor_id}>
                {ins.name}
              </option>
            ))}
          </select>
        </div>
        <div className="control-group">
          <label htmlFor="filter-length">Length</label>
          <select id="filter-length" value={weekFilter} onChange={(e) => setWeekFilter(e.target.value)}>
            <option value="all">Any length</option>
            {weekOptions.map((w) => (
              <option key={w} value={w}>
                {w} weeks
              </option>
            ))}
          </select>
        </div>
        <div className="control-group">
          <label htmlFor="sort-order">Sort</label>
          <select id="sort-order" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="featured">Featured</option>
            <option value="title">Title A–Z</option>
            <option value="shortest">Shortest first</option>
            <option value="longest">Longest first</option>
          </select>
        </div>
        <p className="results-count">
          {filtered.length} {filtered.length === 1 ? 'course' : 'courses'}
          {filtersActive && (
            <button className="link-btn" type="button" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </p>
      </section>

      {filtered.length > 0 ? (
        <section className="course-grid" aria-label="Course catalog">
          {filtered.map((course) => (
            <CourseCard key={course.course_id} course={course} />
          ))}
        </section>
      ) : (
        <section className="empty-state">
          <h2>No courses match your search</h2>
          <p>Try a different keyword, or clear the filters to see all {courses.length} courses.</p>
          <button className="btn btn-accent" type="button" onClick={clearFilters}>
            Clear filters
          </button>
        </section>
      )}

      <footer className="site-footer">
        <p>
          Clio · Online History School — course, class, instructor, and material data served from
          the supplied catalog files.
        </p>
        <p className="footer-note">
          Course imagery via Wikimedia Commons · instructor photos via randomuser.me
        </p>
      </footer>
    </main>
  )
}
