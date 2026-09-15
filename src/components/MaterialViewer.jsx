import { useMemo } from 'react'
import { renderMarkdown } from '../lib/markdown.js'
import { formatDate, materialTypeLabel } from '../lib/format.js'
import { IconClose, IconImage, IconLink, MATERIAL_ICONS, IconDoc } from './Icons.jsx'

export default function MaterialViewer({ course, selection, onClear }) {
  const material = selection?.material ?? null
  const cls = selection?.cls ?? null
  const mdHtml = useMemo(
    () => (material?.kind === 'md' && material.text ? renderMarkdown(material.text) : ''),
    [material]
  )

  const openUrl =
    material?.kind === 'youtube' ? material.externalUrl : material?.url || material?.externalUrl

  return (
    <div className="viewer">
      <div className="viewer-bar">
        <div className="viewer-title-wrap">
          {material ? (
            <>
              <span className="viewer-kicker">
                {cls ? `${cls.class_name} · ${formatDate(cls.date)}` : 'Class material'}
              </span>
              <span className="viewer-title">{material.material_title}</span>
            </>
          ) : (
            <>
              <span className="viewer-kicker">{course.course_id}</span>
              <span className="viewer-title">{course.name}</span>
            </>
          )}
        </div>
        <div className="viewer-actions">
          {material && openUrl && (
            <a className="viewer-btn" href={openUrl} target="_blank" rel="noreferrer" title="Open original in a new tab">
              <IconLink /> Original
            </a>
          )}
          {material ? (
            <button type="button" className="viewer-btn viewer-btn-close" onClick={onClear} title="Show course image (Esc)">
              <IconImage /> Course image <IconClose className="btn-x" />
            </button>
          ) : (
            <span className="viewer-hint">Pick a material from the syllabus</span>
          )}
        </div>
      </div>

      <div className="viewer-stage">
        {!material && (
          <figure className="stage-figure">
            <img src={course.image_url} alt={course.name} />
            <figcaption>
              <strong>{course.name}</strong>
              <span>{course.short_description}</span>
              <span className="fig-credit">Course image · Wikimedia Commons</span>
            </figcaption>
          </figure>
        )}

        {material && !material.available && (
          <div className="stage-missing">
            <IconDoc width={28} height={28} />
            <h3>This material is not available yet</h3>
            <p>The file for “{material.material_title}” has not been published. Check back before class.</p>
          </div>
        )}

        {material?.available && material.kind === 'pdf' && (
          <iframe className="stage-frame" src={material.url} title={material.material_title} loading="lazy" />
        )}

        {material?.available && material.kind === 'video' && (
          <div className="stage-video-wrap">
            <video className="stage-video" src={material.url} controls preload="metadata" playsInline>
              Your browser does not support embedded video.
              <a href={material.url} target="_blank" rel="noreferrer">Open the video file</a>.
            </video>
          </div>
        )}

        {material?.available && material.kind === 'youtube' && material.embedUrl && (
          <div className="stage-video-wrap">
            <iframe
              className="stage-frame-yt"
              src={material.embedUrl}
              title={material.material_title}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        )}

        {material?.available && material.kind === 'md' && (
          <article className="stage-paper">
            <span className="paper-badge">{materialTypeLabel(material.material_type)}</span>
            <div className="markdown-body" dangerouslySetInnerHTML={{ __html: mdHtml }} />
          </article>
        )}
      </div>
    </div>
  )
}
