import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { typeMeta, formatDay } from '../data/platform.js'
import { IconClose, IconExternal, IconDownload, IconLayers, MaterialTypeIcon } from './icons.jsx'

export default function MaterialViewer({ course, material, onClose }) {
  if (!material) {
    return (
      <div className="viewer">
        <div className="viewer__bar">
          <div className="viewer__bar-title">
            <span className="viewer__eyebrow">
              <IconLayers width={14} height={14} /> Now showing
            </span>
            <h2 id="viewer-heading">{course.name}</h2>
          </div>
          <span className="viewer__chip">Course image</span>
        </div>
        <div className="viewer__body viewer__body--plate">
          <figure className="plate">
            <img src={course.imageUrl} alt={`Course image for ${course.name}`} />
            <figcaption>
              <strong>{course.name}</strong>
              <span>
                Select any material in the syllabus to open it here — lectures, readings, videos, and
                assignments stay beside the schedule.
              </span>
            </figcaption>
          </figure>
        </div>
      </div>
    )
  }

  const meta = typeMeta(material.type)
  const Icon = MaterialTypeIcon

  return (
    <div className="viewer">
      <div className="viewer__bar">
        <div className="viewer__bar-title">
          <span className="viewer__eyebrow">
            {material.classLabel} · {material.classTitle}
            {material.classDate ? ` · ${formatDay(material.classDate)}` : ''}
          </span>
          <h2 id="viewer-heading">{material.title}</h2>
        </div>
        <div className="viewer__actions">
          <span className="viewer__chip">
            <Icon icon={meta.icon} width={15} height={15} />
            {meta.label}
          </span>
          {material.openUrl &&
            (meta.viewer === 'markdown' ? (
              <a
                className="btn btn--ghost"
                href={material.openUrl}
                download={material.fileName || undefined}
                aria-label={`Download ${material.title}`}
              >
                <IconDownload width={15} height={15} /> Download
              </a>
            ) : (
              <a
                className="btn btn--ghost"
                href={material.openUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open original of ${material.title} in a new tab`}
              >
                Open original <IconExternal width={15} height={15} />
              </a>
            ))}
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            <IconClose width={15} height={15} /> Course image
          </button>
        </div>
      </div>

      <div className="viewer__body">
        {material.missing && (
          <div className="viewer__missing">
            <p>This material’s file is not available yet. Please check back before class.</p>
          </div>
        )}

        {!material.missing && meta.viewer === 'pdf' && (
          <iframe className="viewer-pdf" src={material.assetUrl} title={`PDF document: ${material.title}`} />
        )}

        {!material.missing && meta.viewer === 'video' && (
          <div className="viewer-video">
            <video controls preload="metadata" src={material.assetUrl}>
              Your browser does not support embedded video. Use “Open original” to watch it.
            </video>
          </div>
        )}

        {!material.missing && meta.viewer === 'markdown' && (
          <div className="viewer-md prose">
            <Markdown remarkPlugins={[remarkGfm]}>{material.text || ''}</Markdown>
          </div>
        )}

        {!material.missing && meta.viewer === 'youtube' && (
          <div className="viewer-youtube">
            {material.embedUrl ? (
              <iframe
                src={material.embedUrl}
                title={material.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className="viewer__missing">
                <p>
                  This video could not be embedded.{' '}
                  <a href={material.openUrl} target="_blank" rel="noreferrer">
                    Watch it on YouTube
                  </a>
                  .
                </p>
              </div>
            )}
          </div>
        )}

        {!material.missing && meta.viewer === 'file' && (
          <div className="viewer__missing">
            <p>
              A preview is not available for this resource.{' '}
              {material.openUrl && (
                <a href={material.openUrl} target="_blank" rel="noreferrer">
                  Open the original file
                </a>
              )}
              .
            </p>
          </div>
        )}
      </div>

      <p className="visually-hidden" role="status">
        Now viewing {material.title}
      </p>
    </div>
  )
}
