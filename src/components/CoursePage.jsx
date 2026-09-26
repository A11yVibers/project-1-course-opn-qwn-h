import { useEffect, useRef, useState } from 'react'
import SmartImage from './SmartImage.jsx'
import MaterialViewer from './MaterialViewer.jsx'
import { MATERIAL_TYPES } from '../lib/data.js'
import { MATERIAL_ICONS, ChevronLeftIcon, ChevronRightIcon, BookIcon, CalendarIcon, MailIcon, PanelIcon } from './icons.jsx'

function MaterialButton({ material, active, onSelect }) {
  const typeMeta = MATERIAL_TYPES[material.type] ?? MATERIAL_TYPES.link
  const Icon = MATERIAL_ICONS[material.type] ?? MATERIAL_ICONS.link
  return (
    <button
      type="button"
      className={`material-btn ${active ? 'is-active' : ''}`}
      onClick={() => onSelect(material)}
      aria-pressed={active}
      title={`${typeMeta.verb}: ${material.title}`}
    >
      <span className="material-btn__icon">
        <Icon size={17} />
      </span>
      <span className="material-btn__text">
        <span className="material-btn__title">{material.title}</span>
        <span className="material-btn__type">{typeMeta.label}</span>
      </span>
      <span className="material-btn__chevron" aria-hidden="true">
        <ChevronRightIcon size={15} />
      </span>
    </button>
  )
}

export default function CoursePage({ course, onBack }) {
  const [collapsed, setCollapsed] = useState(false)
  const [selected, setSelected] = useState(null)
  const viewerRef = useRef(null)

  useEffect(() => {
    document.title = `${course.name} · Clio`
  }, [course.name])

  useEffect(() => {
    if (!selected) return
    if (window.matchMedia('(max-width: 960px)').matches) {
      viewerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [selected])

  function handleSelect(material) {
    setSelected((current) => (current && current.materialId === material.materialId ? null : material))
  }

  return (
    <div className={`course-page ${collapsed ? 'is-collapsed' : ''}`}>
      <aside className="course-left" aria-label="Course information and syllabus">
        <div className="course-left__head">
          <button
            type="button"
            className="btn btn--ghost btn--sm course-left__back"
            onClick={onBack}
          >
            <ChevronLeftIcon size={15} /> Catalog
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--sm course-left__toggle"
            onClick={() => setCollapsed(true)}
            aria-label="Collapse course information panel"
            title="Collapse panel"
          >
            <PanelIcon size={16} /> <span>Hide panel</span>
          </button>
        </div>

        <div className="course-left__scroll">
          <header className="course-info">
            <p className="course-info__code">{course.id}</p>
            <h1 className="course-info__title">{course.name}</h1>
            <div className="course-info__meta">
              <span className="meta-chip">
                <CalendarIcon size={15} /> {course.numberOfWeeks} weeks
              </span>
              <span className="meta-chip">
                <BookIcon size={15} /> {course.numberOfClasses} classes
              </span>
              <span className="meta-chip">
                {course.materialCount} material{course.materialCount === 1 ? '' : 's'} posted
              </span>
            </div>
            <p className="course-info__desc">{course.longDescription}</p>
            {course.instructor && (
              <div className="instructor-card">
                <SmartImage src={course.instructor.photoUrl} alt="" className="avatar" />
                <div className="instructor-card__text">
                  <p className="instructor-card__role">Taught by</p>
                  <p className="instructor-card__name">{course.instructor.name}</p>
                  <p className="instructor-card__mail">
                    <MailIcon size={14} />
                    <a href={`mailto:${course.instructor.email}`}>{course.instructor.email}</a>
                  </p>
                </div>
              </div>
            )}
          </header>

          <section className="syllabus" aria-labelledby="syllabus-heading">
            <div className="syllabus__head">
              <h2 id="syllabus-heading" className="section-title section-title--sm">Syllabus</h2>
              <p className="syllabus__note">{course.classes.length} scheduled classes</p>
            </div>
            <table className="syllabus__table">
              <thead>
                <tr>
                  <th scope="col" className="col-week">Week</th>
                  <th scope="col" className="col-date">Date</th>
                  <th scope="col" className="col-content">Class content</th>
                </tr>
              </thead>
              <tbody>
                {course.classes.map((klass) => (
                  <tr key={klass.classId}>
                    <td className="col-week">
                      <span className="week-badge">W{klass.weekNumber}</span>
                    </td>
                    <td className="col-date">
                      <time dateTime={klass.date}>{klass.dateLabel}</time>
                    </td>
                    <td className="col-content">
                      <h3 className="class-title">{klass.title}</h3>
                      {klass.materials.length > 0 ? (
                        <ul className="material-list">
                          {klass.materials.map((material) => (
                            <li key={material.materialId}>
                              <MaterialButton
                                material={material}
                                active={selected?.materialId === material.materialId}
                                onSelect={handleSelect}
                              />
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="material-empty">Materials for this class will be posted here.</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </aside>

      <button
        type="button"
        className="course-rail"
        onClick={() => setCollapsed(false)}
        aria-label="Expand course information panel"
        title="Expand panel"
      >
        <ChevronRightIcon size={18} />
        <span className="course-rail__label">{course.id} · Info &amp; Syllabus</span>
      </button>

      <main className="course-right" ref={viewerRef} aria-label="Material viewer">
        <MaterialViewer course={course} material={selected} onClose={() => setSelected(null)} />
      </main>
    </div>
  )
}
