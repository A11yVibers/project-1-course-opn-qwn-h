import coursesCsv from '../../project-assets/history_courses.csv?raw'
import classesCsv from '../../project-assets/history_classes.csv?raw'
import instructorsCsv from '../../project-assets/history_instructors.csv?raw'
import materialsCsv from '../../project-assets/course_materials.csv?raw'
import { parseCsv } from '../lib/csv.js'
import { youTubeEmbedUrl } from '../lib/format.js'

// Bundled material files are referenced from project-assets (immutable source
// data). Vite resolves them to served/built asset URLs without copying or
// modifying the originals.
const assetUrlModules = import.meta.glob('../../project-assets/materials/*', {
  eager: true,
  query: '?url',
  import: 'default',
})
const assetTextModules = import.meta.glob('../../project-assets/materials/*.{md,markdown,txt}', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const stripPrefix = (key) => key.replace(/^.*project-assets\//, '')
const assetUrlByPath = Object.fromEntries(
  Object.entries(assetUrlModules).map(([k, v]) => [stripPrefix(k), v])
)
const assetTextByPath = Object.fromEntries(
  Object.entries(assetTextModules)
    .filter(([k]) => /\.(md|markdown|txt)$/i.test(k))
    .map(([k, v]) => [stripPrefix(k), v])
)

function resolveMaterial(row) {
  const type = (row.material_type || '').toLowerCase()
  const path = row.file_path || ''
  const isRemote = /^https?:\/\//i.test(path)

  if (type === 'youtube' || (isRemote && /youtu\.?be/i.test(path))) {
    return {
      ...row,
      kind: 'youtube',
      externalUrl: path,
      embedUrl: youTubeEmbedUrl(path),
      available: Boolean(youTubeEmbedUrl(path)),
    }
  }
  if (isRemote) {
    return { ...row, kind: type || 'link', externalUrl: path, available: true }
  }
  if (type === 'md' || type === 'markdown') {
    const text = assetTextByPath[path]
    return { ...row, kind: 'md', text, available: typeof text === 'string' }
  }
  const url = assetUrlByPath[path]
  return { ...row, kind: type, url, available: Boolean(url) }
}

const instructorsById = new Map(
  parseCsv(instructorsCsv).map((row) => [row.instructor_id, row])
)

const materialsByClassId = new Map()
for (const row of parseCsv(materialsCsv)) {
  const list = materialsByClassId.get(row.class_id) ?? []
  list.push(resolveMaterial(row))
  materialsByClassId.set(row.class_id, list)
}
for (const list of materialsByClassId.values()) {
  list.sort((a, b) => Number(a.display_order) - Number(b.display_order))
}

const classesByCourseId = new Map()
for (const row of parseCsv(classesCsv)) {
  const entry = {
    ...row,
    week_number: Number(row.week_number),
    materials: materialsByClassId.get(row.class_id) ?? [],
  }
  const list = classesByCourseId.get(row.course_id) ?? []
  list.push(entry)
  classesByCourseId.set(row.course_id, list)
}
for (const list of classesByCourseId.values()) {
  list.sort((a, b) => a.date.localeCompare(b.date) || a.class_id.localeCompare(b.class_id))
}

const courses = parseCsv(coursesCsv).map((row) => {
  const classes = classesByCourseId.get(row.course_id) ?? []
  return {
    ...row,
    number_of_classes: Number(row.number_of_classes),
    number_of_weeks: Number(row.number_of_weeks),
    instructor: instructorsById.get(row.instructor_id) ?? null,
    classes,
    material_count: classes.reduce((n, c) => n + c.materials.length, 0),
  }
})

const coursesById = new Map(courses.map((c) => [c.course_id, c]))

export const instructors = [...instructorsById.values()]

export function getCourse(courseId) {
  return coursesById.get(String(courseId || '').toUpperCase()) ?? null
}

export const catalog = Object.freeze({ courses, instructors, getCourse })
