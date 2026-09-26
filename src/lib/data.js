import { parseCsv } from './csv.js'
import coursesCsv from '../../project-assets/history_courses.csv?raw'
import classesCsv from '../../project-assets/history_classes.csv?raw'
import instructorsCsv from '../../project-assets/history_instructors.csv?raw'
import materialsCsv from '../../project-assets/course_materials.csv?raw'

const materialAssetUrls = import.meta.glob('../../project-assets/materials/*', {
  query: '?url',
  import: 'default',
  eager: true,
})

const materialRawTexts = import.meta.glob('../../project-assets/materials/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

function assetKey(globKey) {
  const idx = globKey.indexOf('project-assets/')
  return idx === -1 ? globKey : globKey.slice(idx + 'project-assets/'.length)
}

const urlByPath = Object.fromEntries(Object.entries(materialAssetUrls).map(([k, v]) => [assetKey(k), v]))
const rawByPath = Object.fromEntries(Object.entries(materialRawTexts).map(([k, v]) => [assetKey(k), v]))

export function youTubeEmbedUrl(url) {
  try {
    const u = new URL(url)
    if (u.hostname === 'youtu.be') {
      const id = u.pathname.split('/').filter(Boolean)[0]
      return id ? `https://www.youtube.com/embed/${id}` : url
    }
    const id = u.searchParams.get('v') || u.pathname.split('/').filter(Boolean).pop()
    return id ? `https://www.youtube.com/embed/${id}` : url
  } catch {
    return url
  }
}

export const MATERIAL_TYPES = {
  pdf: { label: 'PDF', verb: 'Read' },
  video: { label: 'Video', verb: 'Watch' },
  youtube: { label: 'YouTube', verb: 'Watch' },
  md: { label: 'Markdown', verb: 'Read' },
  slides: { label: 'Slides', verb: 'View' },
  link: { label: 'Link', verb: 'Open' },
}

function resolveMaterial(raw) {
  const material = {
    materialId: raw.material_id,
    classId: raw.class_id,
    courseId: raw.course_id,
    order: Number(raw.display_order) || 0,
    title: raw.material_title,
    type: (raw.material_type || 'link').toLowerCase(),
    path: raw.file_path,
    url: null,
    embedUrl: null,
    content: null,
    downloadable: false,
  }

  if (/^https?:\/\//i.test(raw.file_path)) {
    material.url = raw.file_path
    if (material.type === 'youtube') material.embedUrl = youTubeEmbedUrl(raw.file_path)
  } else {
    material.url = urlByPath[raw.file_path] ?? null
    material.downloadable = Boolean(material.url)
    if (material.type === 'md') material.content = rawByPath[raw.file_path] ?? null
  }
  return material
}

const instructorRows = parseCsv(instructorsCsv)
const classRows = parseCsv(classesCsv)
const materialRows = parseCsv(materialsCsv)
const courseRows = parseCsv(coursesCsv)

export const instructors = instructorRows.map((r) => ({
  id: r.instructor_id,
  name: r.name,
  email: r.email,
  photoUrl: r.photo_url,
}))

const instructorById = Object.fromEntries(instructors.map((ins) => [ins.id, ins]))

const materialsByClass = new Map()
for (const row of materialRows) {
  const material = resolveMaterial(row)
  if (!materialsByClass.has(material.classId)) materialsByClass.set(material.classId, [])
  materialsByClass.get(material.classId).push(material)
}
for (const list of materialsByClass.values()) list.sort((a, b) => a.order - b.order)

function classTitle(className) {
  return className.replace(/^Class\s*\d+\s*:\s*/i, '').trim() || className
}

function formatClassDate(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number)
  if (!y || !m || !d) return isoDate
  const date = new Date(y, m - 1, d)
  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' })
  const formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  return `${weekday} · ${formatted}`
}

const classesByCourse = new Map()
for (const row of classRows) {
  const klass = {
    classId: row.class_id,
    courseId: row.course_id,
    weekNumber: Number(row.week_number) || 0,
    date: row.date,
    dateLabel: formatClassDate(row.date),
    name: row.class_name,
    title: classTitle(row.class_name),
    materials: materialsByClass.get(row.class_id) ?? [],
  }
  if (!classesByCourse.has(klass.courseId)) classesByCourse.set(klass.courseId, [])
  classesByCourse.get(klass.courseId).push(klass)
}
for (const list of classesByCourse.values()) {
  list.sort((a, b) => a.weekNumber - b.weekNumber || a.date.localeCompare(b.date) || a.classId.localeCompare(b.classId))
}

export const courses = courseRows.map((row) => {
  const classes = classesByCourse.get(row.course_id) ?? []
  return {
    id: row.course_id,
    name: row.name,
    shortDescription: row.short_description,
    longDescription: row.long_description,
    numberOfClasses: Number(row.number_of_classes) || classes.length,
    numberOfWeeks: Number(row.number_of_weeks) || 0,
    imageUrl: row.image_url,
    instructor: instructorById[row.instructor_id] ?? null,
    classes,
    materialCount: classes.reduce((sum, c) => sum + c.materials.length, 0),
  }
})

export const platformStats = {
  courseCount: courses.length,
  instructorCount: instructors.length,
  classCount: courses.reduce((sum, c) => sum + c.classes.length, 0),
  weekOptions: [...new Set(courses.map((c) => c.numberOfWeeks).filter(Boolean))].sort((a, b) => a - b),
}

export function getCourse(courseId) {
  return courses.find((c) => c.id === courseId) ?? null
}
