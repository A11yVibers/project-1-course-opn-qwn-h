import { useMemo, useState } from 'react'
import { IconSearch, IconClose, IconClock, IconCalendar } from './icons.jsx'

const SORT_OPTIONS = [
  { value: 'code', label: 'Course code' },
  { value: 'title', label: 'Title A–Z' },
  { value: 'shortest', label: 'Shortest first' },
  { value: 'longest', label: 'Longest first' },
]

export default function CatalogPage({ platform }) {
  const [query, setQuery] = useState('')
  const [instructorId, setInstructorId] = useState('all')
  const [weekFilter, setWeekFilter] = useState('all')
  const [sort, setSort] = useState('code')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = platform.courses.filter((course) => {
      if (instructorId !== 'all' && (!course.instructor || course.instructor.instructorId !== instructorId)) {
        return false
      }
      if (weekFilter !== 'all' && String(course.numberOfWeeks) !== weekFilter) return false
      if (q && !course.searchText.includes(q)) return false
      return true
    })
    const sorted = filtered.slice()
    if (sort === 'title') {
      sorted.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sort === 'shortest') {
      sorted.sort((a, b) => a.numberOfWeeks - b.numberOfWeeks || a.courseId.localeCompare(b.courseId))
    } else if (sort === 'longest') {
      sorted.sort((a, b) => b.numberOfWeeks - a.numberOfWeeks || a.courseId.localeCompare(b.courseId))
    } else {
      sorted.sort((a, b) => a.courseId.localeCompare(b.courseId))
    }
    return sorted
  }, [platform, query, instructorId, weekFilter, sort])

  const filtersActive = query.trim() !== '' || instructorId !== 'all' || weekFilter !== 'all' || sort !== 'code'

  function clearFilters() {
    setQuery('')
    setInstructorId('all')
    setWeekFilter('all')
    setSort('code')
  }

  return (
    <>
      <section className="catalog-hero">
        <div className="catalog-hero__inner">
          <p className="eyebrow">{platform.term ? `${platform.term} term` : 'Now enrolling'} · Open catalog</p>
          <h1>
            {platform.totals.courses} journeys through <em>world history</em>
          </h1>
          <p className="catalog-hero__lede">
            Seminar-style courses from the Nile to the Silk Roads — every syllabus, lecture, reading, and
            assignment open beside a persistent material viewer.
          </p>
          <dl className="stat-strip">
            <div>
              <dt>Courses</dt>
              <dd>{platform.totals.courses}</dd>
            </div>
            <div>
              <dt>Classes</dt>
              <dd>{platform.totals.classes}</dd>
            </div>
            <div>
              <dt>Instructors</dt>
              <dd>{platform.totals.instructors}</dd>
            </div>
            <div>
              <dt>Term length</dt>
              <dd>
                {Math.min(...platform.totals.weekOptions)}–{Math.max(...platform.totals.weekOptions)} weeks
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="catalog" aria-labelledby="catalog-heading">
        <h2 id="catalog-heading" className="visually-hidden">
          Course catalog
        </h2>

        <div className="toolbar" role="search" aria-label="Course catalog filters">
          <div className="toolbar__search">
            <IconSearch width={18} height={18} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search courses, topics, or instructors…"
              aria-label="Search courses"
            />
            {query && (
              <button type="button" className="toolbar__clear" onClick={() => setQuery('')} aria-label="Clear search">
                <IconClose width={16} height={16} />
              </button>
            )}
          </div>

          <label className="toolbar__field">
            <span>Instructor</span>
            <select value={instructorId} onChange={(event) => setInstructorId(event.target.value)}>
              <option value="all">All instructors</option>
              {platform.instructors.map((instructor) => (
                <option key={instructor.instructorId} value={instructor.instructorId}>
                  {instructor.name}
                </option>
              ))}
            </select>
          </label>

          <label className="toolbar__field">
            <span>Length</span>
            <select value={weekFilter} onChange={(event) => setWeekFilter(event.target.value)}>
              <option value="all">Any length</option>
              {platform.totals.weekOptions.map((weeks) => (
                <option key={weeks} value={String(weeks)}>
                  {weeks} weeks
                </option>
              ))}
            </select>
          </label>

          <label className="toolbar__field">
            <span>Sort</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="catalog__status">
          <p role="status" aria-live="polite">
            Showing {results.length} of {platform.totals.courses} courses
          </p>
          {filtersActive && (
            <button type="button" className="linkish" onClick={clearFilters}>
              <IconClose width={14} height={14} /> Reset filters
            </button>
          )}
        </div>

        {results.length === 0 ? (
          <div className="empty-state">
            <p>No courses match your search.</p>
            <button type="button" className="btn" onClick={clearFilters}>
              Reset filters
            </button>
          </div>
        ) : (
          <div className="course-grid">
            {results.map((course) => (
              <CourseCard key={course.courseId} course={course} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}

function CourseCard({ course }) {
  return (
    <article className="course-card">
      <a className="course-card__link" href={`#/course/${course.courseId}`}>
        <div className="course-card__media">
          <img src={course.imageUrl} alt="" loading="lazy" />
          <span className="course-card__code">{course.courseId}</span>
        </div>
        <div className="course-card__body">
          <h3>{course.name}</h3>
          <p>{course.shortDescription}</p>
          <div className="course-card__meta">
            {course.instructor && (
              <span className="instructor-chip">
                <img src={course.instructor.photoUrl} alt="" loading="lazy" />
                {course.instructor.name}
              </span>
            )}
            <span className="meta-chip">
              <IconCalendar width={14} height={14} /> {course.numberOfClasses} classes
            </span>
            <span className="meta-chip">
              <IconClock width={14} height={14} /> {course.numberOfWeeks} weeks
            </span>
          </div>
        </div>
      </a>
    </article>
  )
}
