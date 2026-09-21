import { useEffect, useRef, useState } from 'react'
import SyllabusTable from './SyllabusTable.jsx'
import MaterialViewer from './MaterialViewer.jsx'
import { IconArrowLeft, IconPanelCollapse, IconPanelExpand, IconClock, IconCalendar, IconLayers } from './icons.jsx'

export default function CoursePage({ course, platform }) {
  const [collapsed, setCollapsed] = useState(false)
  const [selected, setSelected] = useState(null)
  const viewerWrapRef = useRef(null)

  useEffect(() => {
    if (!selected) return
    if (window.matchMedia('(max-width: 1023px)').matches && viewerWrapRef.current) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      viewerWrapRef.current.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
    }
  }, [selected])

  return (
    <>
      <section className="course-hero">
        <img className="course-hero__bg" src={course.imageUrl} alt="" />
        <div className="course-hero__scrim" aria-hidden="true" />
        <div className="course-hero__content">
          <a className="crumb" href="#/">
            <IconArrowLeft width={16} height={16} /> All courses
          </a>
          <p className="course-hero__code">
            {course.courseId}
            {platform.term ? ` · ${platform.term} term` : ''}
          </p>
          <h1>{course.name}</h1>
          <p className="course-hero__short">{course.shortDescription}</p>
          <ul className="hero-facts">
            {course.instructor && (
              <li>
                <img className="hero-facts__avatar" src={course.instructor.photoUrl} alt="" />
                <span>
                  {course.instructor.name}
                  <small>Course instructor</small>
                </span>
              </li>
            )}
            <li>
              <IconClock width={17} height={17} />
              <span>
                {course.numberOfWeeks} weeks
                <small>Term length</small>
              </span>
            </li>
            <li>
              <IconCalendar width={17} height={17} />
              <span>
                {course.numberOfClasses} classes
                <small>Scheduled sessions</small>
              </span>
            </li>
            <li>
              <IconLayers width={17} height={17} />
              <span>
                {course.materialCount} resources
                <small>Posted materials</small>
              </span>
            </li>
          </ul>
        </div>
      </section>

      <div className={collapsed ? 'course-layout course-layout--collapsed' : 'course-layout'}>
        <aside className="course-panel" id="course-panel" aria-label="Course information and syllabus">
          {collapsed && (
            <button
              type="button"
              className="panel-rail"
              onClick={() => setCollapsed(false)}
              aria-expanded="false"
              aria-controls="course-panel-body"
              title="Expand course details and syllabus"
            >
              <IconPanelExpand width={18} height={18} />
              <span className="panel-rail__label">Course details &amp; syllabus</span>
            </button>
          )}
          <div className="course-panel__inner" id="course-panel-body" hidden={collapsed}>
            <div className="course-panel__head">
              <h2>Course details</h2>
              <button
                type="button"
                className="collapse-btn"
                onClick={() => setCollapsed(true)}
                aria-expanded="true"
                aria-controls="course-panel-body"
                title="Collapse panel"
              >
                <IconPanelCollapse width={16} height={16} />
                <span>Collapse</span>
              </button>
            </div>

            <section className="panel-section" aria-labelledby="about-heading">
              <h3 id="about-heading">About this course</h3>
              <p>{course.longDescription}</p>
            </section>

            {course.instructor && (
              <section className="panel-section" aria-labelledby="instructor-heading">
                <h3 id="instructor-heading">Instructor</h3>
                <div className="instructor-card">
                  <img src={course.instructor.photoUrl} alt={`Portrait of ${course.instructor.name}`} />
                  <div className="instructor-card__text">
                    <p className="instructor-card__name">{course.instructor.name}</p>
                    <a className="instructor-card__email" href={`mailto:${course.instructor.email}`}>
                      {course.instructor.email}
                    </a>
                  </div>
                </div>
              </section>
            )}

            <section className="panel-section panel-section--syllabus" aria-labelledby="syllabus-heading">
              <h3 id="syllabus-heading">Syllabus</h3>
              <SyllabusTable
                course={course}
                selectedMaterialId={selected ? selected.materialId : null}
                onSelectMaterial={setSelected}
              />
            </section>
          </div>
        </aside>

        <section className="viewer-wrap" ref={viewerWrapRef} aria-label="Material viewer">
          <MaterialViewer course={course} material={selected} onClose={() => setSelected(null)} />
        </section>
      </div>
    </>
  )
}
