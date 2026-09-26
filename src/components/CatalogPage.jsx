import { useEffect, useMemo, useState } from 'react'
import { courses, instructors, platformStats } from '../lib/data.js'
import SmartImage from './SmartImage.jsx'
import { SearchIcon, BookIcon, ClockIcon, CalendarIcon, ChevronRightIcon } from './icons.jsx'

const SORTS = [
  { value: 'title', label: 'Sort: A–Z' },
  { value: 'shortest', label: 'Sort: Shortest first' },
  { value: 'longest', label: 'Sort: Longest first' },
  { value: 'code', label: 'Sort: Course code' },
]

export default function CatalogPage({ onOpenCourse }) {
  const [query, setQuery] = useState('')
  const [instructorId, setInstructorId] = useState('all')
  const [weeks, setWeeks] = useState('all')
  const [sort, setSort] = useState('title')

  useEffect(() => {
    document.title = 'Clio · Online History Courses'
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = courses.filter((course) => {
      if (instructorId !== 'all' && (!course.instructor || course.instructor.id !== instructorId)) return false
      if (weeks !== 'all' && String(course.numberOfWeeks) !== weeks) return false
      if (!q) return true
      const haystack = [
        course.id,
        course.name,
        course.shortDescription,
        course.longDescription,
        course.instructor?.name ?? '',
        ...course.classes.map((c) => c.title),
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'shortest':
          return a.numberOfWeeks - b.numberOfWeeks || a.name.localeCompare(b.name)
        case 'longest':
          return b.numberOfWeeks - a.numberOfWeeks || a.name.localeCompare(b.name)
        case 'code':
          return a.id.localeCompare(b.id)
        default:
          return a.name.localeCompare(b.name)
      }
    })
    return list
  }, [query, instructorId, weeks, sort])

  const activeFilters = instructorId !== 'all' || weeks !== 'all' || query.trim() !== ''

  function resetFilters() {
    setQuery('')
    setInstructorId('all')
    setWeeks('all')
  }

  return (
    <main className="catalog">
      <section className="hero">
        <div className="hero__inner">
          <p className="hero__kicker">An online school of history</p>
          <h1 className="hero__title">
            Study the past, <em>route by route</em>, era by era.
          </h1>
          <p className="hero__lede">
            Seminar-style courses from ancient rivers valleys to the modern world — each built around weekly
            classes with lectures, readings, and assignments you can open right inside the course page.
          </p>
          <dl className="hero__stats">
            <div>
              <dt>Courses</dt>
              <dd>{platformStats.courseCount}</dd>
            </div>
            <div>
              <dt>Classes</dt>
              <dd>{platformStats.classCount}</dd>
            </div>
            <div>
              <dt>Historians</dt>
              <dd>{platformStats.instructorCount}</dd>
            </div>
            <div>
              <dt>Format</dt>
              <dd>Online</dd>
            </div>
          </dl>
        </div>
        <div className="hero__routes" aria-hidden="true">
          <span className="hero__route hero__route--1" />
          <span className="hero__route hero__route--2" />
          <span className="hero__route hero__route--3" />
        </div>
      </section>

      <section className="catalog__body" aria-labelledby="catalog-heading">
        <div className="catalog__head">
          <h2 id="catalog-heading" className="section-title">
            Course catalog
          </h2>
          <p className="catalog__count" role="status">
            Showing {filtered.length} of {courses.length} courses
          </p>
        </div>

        <div className="toolbar">
          <div className="toolbar__search">
            <SearchIcon size={18} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses, topics, or instructors…"
              aria-label="Search courses"
            />
          </div>
          <div className="toolbar__filters">
            <label className="select">
              <span className="select__label">Instructor</span>
              <select value={instructorId} onChange={(e) => setInstructorId(e.target.value)}>
                <option value="all">All instructors</option>
                {instructors.map((ins) => (
                  <option key={ins.id} value={ins.id}>
                    {ins.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="select">
              <span className="select__label">Length</span>
              <select value={weeks} onChange={(e) => setWeeks(e.target.value)}>
                <option value="all">Any length</option>
                {platformStats.weekOptions.map((w) => (
                  <option key={w} value={String(w)}>
                    {w} weeks
                  </option>
                ))}
              </select>
            </label>
            <label className="select">
              <span className="select__label">Order</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            {activeFilters && (
              <button type="button" className="btn btn--ghost toolbar__reset" onClick={resetFilters}>
                Clear filters
              </button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <p>No courses match your search.</p>
            <button type="button" className="btn btn--primary" onClick={resetFilters}>
              Reset search
            </button>
          </div>
        ) : (
          <ul className="course-grid">
            {filtered.map((course) => (
              <li key={course.id}>
                <article className="course-card">
                  <div className="course-card__media">
                    <SmartImage src={course.imageUrl} alt={course.name} />
                    <span className="course-card__code">{course.id}</span>
                  </div>
                  <div className="course-card__body">
                    <h3 className="course-card__title">{course.name}</h3>
                    <p className="course-card__desc">{course.shortDescription}</p>
                    {course.instructor && (
                      <p className="course-card__instructor">
                        <SmartImage src={course.instructor.photoUrl} alt="" className="avatar avatar--sm" />
                        <span>{course.instructor.name}</span>
                      </p>
                    )}
                    <footer className="course-card__meta">
                      <span className="meta-chip">
                        <BookIcon size={15} /> {course.numberOfClasses} classes
                      </span>
                      <span className="meta-chip">
                        <CalendarIcon size={15} /> {course.numberOfWeeks} weeks
                      </span>
                      {course.materialCount > 0 && (
                        <span className="meta-chip meta-chip--accent">
                          <ClockIcon size={15} /> {course.materialCount} materials live
                        </span>
                      )}
                    </footer>
                    <button type="button" className="btn btn--primary course-card__cta" onClick={() => onOpenCourse(course.id)}>
                      Enter course <ChevronRightIcon size={16} />
                    </button>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
