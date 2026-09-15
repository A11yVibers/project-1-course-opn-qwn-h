import { useCallback, useEffect, useRef, useState } from 'react'
import MaterialViewer from './MaterialViewer.jsx'
import { formatDate, materialTypeLabel } from '../lib/format.js'
import {
  IconArrowLeft,
  IconCalendar,
  IconStack,
  IconDoc,
  IconChevronLeft,
  IconChevronRight,
  MATERIAL_ICONS,
} from './Icons.jsx'

export default function CoursePage({ course }) {
  const [collapsed, setCollapsed] = useState(false)
  const [selection, setSelection] = useState(null)
  const viewerRef = useRef(null)

  const selectMaterial = useCallback((material, cls) => {
    setSelection((prev) =>
      prev && prev.material.material_id === material.material_id ? null : { material, cls }
    )
    if (window.matchMedia('(max-width: 980px)').matches) {
      requestAnimationFrame(() =>
        viewerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      )
    }
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setSelection(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className={`course-layout${collapsed ? ' is-collapsed' : ''}`}>
      <aside className="course-pane" aria-label="Course information and syllabus">
        <div className="course-pane-inner">
          <a className="back-link" href="#/">
            <IconArrowLeft /> All courses
          </a>

          <header className="course-head">
            <span className="course-code">{course.course_id}</span>
            <h1 className="course-title">{course.name}</h1>
            <p className="course-tagline">{course.short_description}</p>
          </header>

          {course.instructor && (
            <div className="instructor-card">
              <img className="avatar avatar-lg" src={course.instructor.photo_url} alt="" />
              <div className="instructor-info">
                <span className="instructor-role">Instructor</span>
                <span className="instructor-name">{course.instructor.name}</span>
                <a className="instructor-email" href={`mailto:${course.instructor.email}`}>
                  {course.instructor.email}
                </a>
              </div>
            </div>
          )}

          <dl className="course-stats">
            <div>
              <dt><IconCalendar /> Weeks</dt>
              <dd>{course.number_of_weeks}</dd>
            </div>
            <div>
              <dt><IconStack /> Classes</dt>
              <dd>{course.number_of_classes}</dd>
            </div>
            <div>
              <dt><IconDoc /> Materials</dt>
              <dd>{course.material_count}</dd>
            </div>
          </dl>

          <section className="course-about" aria-label="About this course">
            <h2>About this course</h2>
            <p>{course.long_description}</p>
          </section>

          <section className="syllabus" aria-label="Syllabus">
            <h2>Syllabus</h2>
            <p className="syllabus-hint">
              Select any material to open it in the viewing area — lectures, readings, and
              assignments stay on this page.
            </p>
            <table className="syllabus-table">
              <thead>
                <tr>
                  <th scope="col">Week</th>
                  <th scope="col">Date</th>
                  <th scope="col">Class Content</th>
                </tr>
              </thead>
              <tbody>
                {course.classes.map((cls) => (
                  <tr key={cls.class_id} className={selection?.cls?.class_id === cls.class_id ? 'row-active' : undefined}>
                    <td className="cell-week">
                      <span className="week-badge" title={`Week ${cls.week_number}`}>
                        {cls.week_number}
                      </span>
                    </td>
                    <td className="cell-date">{formatDate(cls.date)}</td>
                    <td className="cell-content">
                      <div className="class-title">{cls.class_name}</div>
                      {cls.materials.length > 0 ? (
                        <ul className="material-list">
                          {cls.materials.map((m) => {
                            const Icon = MATERIAL_ICONS[m.kind] ?? IconDoc
                            const isSelected = selection?.material.material_id === m.material_id
                            return (
                              <li key={m.material_id}>
                                <button
                                  type="button"
                                  className={`material-chip kind-${m.kind}${isSelected ? ' is-selected' : ''}`}
                                  aria-pressed={isSelected}
                                  disabled={!m.available}
                                  title={m.available ? `View "${m.material_title}" in the material viewer` : 'File not available yet'}
                                  onClick={() => selectMaterial(m, cls)}
                                >
                                  <Icon className="chip-icon" />
                                  <span className="chip-title">{m.material_title}</span>
                                  <span className="chip-type">{materialTypeLabel(m.material_type)}</span>
                                </button>
                              </li>
                            )
                          })}
                        </ul>
                      ) : (
                        <p className="no-materials">Materials will be posted before this class.</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </aside>

      <div className="pane-rail">
        <button
          type="button"
          className="rail-toggle"
          aria-expanded={!collapsed}
          aria-label={collapsed ? 'Expand course panel' : 'Collapse course panel'}
          title={collapsed ? 'Expand course panel' : 'Collapse course panel'}
          onClick={() => setCollapsed((v) => !v)}
        >
          {collapsed ? <IconChevronRight /> : <IconChevronLeft />}
        </button>
        {collapsed && <span className="rail-label">Course &amp; Syllabus</span>}
      </div>

      <section className="viewer-pane" ref={viewerRef} aria-label="Material viewer" aria-live="polite">
        <MaterialViewer course={course} selection={selection} onClear={() => setSelection(null)} />
      </section>
    </div>
  )
}
