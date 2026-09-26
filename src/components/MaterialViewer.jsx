import { useMemo } from 'react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { MATERIAL_TYPES } from '../lib/data.js'
import SmartImage from './SmartImage.jsx'
import { MATERIAL_ICONS, CloseIcon, ExternalIcon, BookIcon, CalendarIcon, MailIcon } from './icons.jsx'

function OverviewPane({ course }) {
  return (
    <div className="viewer viewer--overview">
      <div className="viewer__stage">
        <SmartImage src={course.imageUrl} alt={course.name} className="viewer__hero-image" />
      </div>
      <div className="viewer__overview-card">
        <p className="viewer__course-code">{course.id}</p>
        <h2>{course.name}</h2>
        <p className="viewer__overview-desc">{course.shortDescription}</p>
        <div className="viewer__overview-meta">
          <span className="meta-chip">
            <CalendarIcon size={15} /> {course.numberOfWeeks} weeks
          </span>
          <span className="meta-chip">
            <BookIcon size={15} /> {course.numberOfClasses} classes
          </span>
        </div>
        {course.instructor && (
          <div className="viewer__instructor">
            <SmartImage src={course.instructor.photoUrl} alt="" className="avatar" />
            <div>
              <p className="viewer__instructor-name">{course.instructor.name}</p>
              <p className="viewer__instructor-mail">
                <MailIcon size={14} />
                <a href={`mailto:${course.instructor.email}`}>{course.instructor.email}</a>
              </p>
            </div>
          </div>
        )}
        <p className="viewer__hint">Select any material from the syllabus to open it here.</p>
      </div>
    </div>
  )
}

export default function MaterialViewer({ course, material, onClose }) {
  const markdownHtml = useMemo(() => {
    if (!material || material.type !== 'md' || !material.content) return ''
    return DOMPurify.sanitize(marked.parse(material.content))
  }, [material])

  if (!material) return <OverviewPane course={course} />

  const typeMeta = MATERIAL_TYPES[material.type] ?? MATERIAL_TYPES.link
  const Icon = MATERIAL_ICONS[material.type] ?? MATERIAL_ICONS.link
  const externalUrl = material.url && /^https?:\/\//i.test(material.url) ? material.url : null

  return (
    <div className="viewer viewer--material">
      <header className="viewer__bar">
        <span className={`type-badge type-badge--${material.type}`}>
          <Icon size={16} /> {typeMeta.label}
        </span>
        <h2 className="viewer__title" title={material.title}>
          {material.title}
        </h2>
        <div className="viewer__actions">
          {externalUrl && (
            <a className="btn btn--ghost btn--sm" href={externalUrl} target="_blank" rel="noreferrer">
              <ExternalIcon size={15} /> Open original
            </a>
          )}
          {material.downloadable && !externalUrl && (
            <a className="btn btn--ghost btn--sm" href={material.url} download>
              <ExternalIcon size={15} /> Download
            </a>
          )}
          <button type="button" className="btn btn--ghost btn--sm" onClick={onClose} aria-label="Close material and return to course image">
            <CloseIcon size={15} /> Course image
          </button>
        </div>
      </header>
      <div className="viewer__body">
        {material.type === 'pdf' && material.url && (
          <iframe className="viewer__frame" src={material.url} title={material.title} loading="lazy" />
        )}
        {material.type === 'video' && material.url && (
          <div className="viewer__video-wrap">
            <video className="viewer__video" src={material.url} controls preload="metadata">
              Your browser does not support embedded video.
            </video>
          </div>
        )}
        {material.type === 'youtube' && material.embedUrl && (
          <iframe
            className="viewer__frame"
            src={material.embedUrl}
            title={material.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        )}
        {material.type === 'md' && (
          <div className="viewer__markdown">
            <article className="md-sheet markdown-body" dangerouslySetInnerHTML={{ __html: markdownHtml }} />
          </div>
        )}
        {!material.url && material.type !== 'md' && (
          <div className="viewer__missing">
            <p>This material is not available for preview yet.</p>
          </div>
        )}
        {material.type === 'md' && !material.content && (
          <div className="viewer__missing">
            <p>This document is not available for preview yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
