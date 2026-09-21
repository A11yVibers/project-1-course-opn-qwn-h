import Papa from 'papaparse'
import coursesCsv from '../../project-assets/history_courses.csv?raw'
import classesCsv from '../../project-assets/history_classes.csv?raw'
import instructorsCsv from '../../project-assets/history_instructors.csv?raw'
import materialsCsv from '../../project-assets/course_materials.csv?raw'

const assetUrls = import.meta.glob('../../project-assets/materials/*', {
  query: '?url',
  import: 'default',
  eager: true,
})

const assetTexts = import.meta.glob('../../project-assets/materials/*.{md,markdown,txt}', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const TYPE_META = {
  pdf: { label: 'PDF', viewer: 'pdf', icon: 'document' },
  video: { label: 'Video', viewer: 'video', icon: 'video' },
  md: { label: 'Markdown', viewer: 'markdown', icon: 'markdown' },
  markdown: { label: 'Markdown', viewer: 'markdown', icon: 'markdown' },
  youtube: { label: 'YouTube', viewer: 'youtube', icon: 'youtube' },
}

export function typeMeta(type) {
  const key = String(type || '').toLowerCase()
  if (TYPE_META[key]) return TYPE_META[key]
  return {
    label: key ? key.charAt(0).toUpperCase() + key.slice(1) : 'Resource',
    viewer: 'file',
    icon: 'document',
  }
}

function parseRows(csv) {
  const normalized = csv.replace(/\r\n?/g, '\n')
  return Papa.parse(normalized.trim(), { header: true, skipEmptyLines: true }).data
}

function findAssetKey(map, filePath) {
  const suffix = filePath.replace(/^\.?\//, '')
  return Object.keys(map).find((key) => key.endsWith('/' + suffix)) || null
}

function youTubeEmbedUrl(url) {
  const match = /(?:youtu\.be\/|(?:www\.)?youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]+)/.exec(url || '')
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}` : null
}

function splitClassName(name) {
  const match = /^\s*Class\s*(\d+)\s*:\s*(.+)$/.exec(name || '')
  if (match) return { label: `Class ${match[1]}`, title: match[2].trim() }
  return { label: '', title: String(name || '').trim() }
}

function seasonName(month) {
  if (month <= 2 || month === 12) return 'Winter'
  if (month <= 5) return 'Spring'
  if (month <= 8) return 'Summer'
  return 'Fall'
}

const instructors = parseRows(instructorsCsv).map((row) => ({
  instructorId: row.instructor_id,
  name: row.name,
  email: row.email,
  photoUrl: row.photo_url,
}))

const instructorsById = {}
for (const instructor of instructors) instructorsById[instructor.instructorId] = instructor

const materialsByClass = {}
for (const row of parseRows(materialsCsv)) {
  const filePath = String(row.file_path || '').trim()
  const isRemote = /^https?:\/\//i.test(filePath)
  const urlKey = isRemote ? null : findAssetKey(assetUrls, filePath)
  const textKey = isRemote ? null : findAssetKey(assetTexts, filePath)
  const type = String(row.material_type || '').toLowerCase()
  const material = {
    materialId: row.material_id,
    classId: row.class_id,
    courseId: row.course_id,
    displayOrder: Number(row.display_order) || 0,
    title: row.material_title,
    type,
    meta: typeMeta(type),
    assetUrl: isRemote ? filePath : urlKey ? assetUrls[urlKey] : null,
    text: textKey ? assetTexts[textKey] : null,
    embedUrl: type === 'youtube' ? youTubeEmbedUrl(filePath) : null,
    openUrl: isRemote ? filePath : urlKey ? assetUrls[urlKey] : null,
    fileName: isRemote ? null : filePath.split('/').pop() || null,
    missing: !isRemote && !urlKey && !textKey,
    classLabel: '',
    classTitle: '',
  }
  if (!materialsByClass[row.class_id]) materialsByClass[row.class_id] = []
  materialsByClass[row.class_id].push(material)
}
for (const list of Object.values(materialsByClass)) {
  list.sort((a, b) => a.displayOrder - b.displayOrder)
}

const classesByCourse = {}
for (const row of parseRows(classesCsv)) {
  const { label, title } = splitClassName(row.class_name)
  const cls = {
    classId: row.class_id,
    courseId: row.course_id,
    weekNumber: Number(row.week_number) || 0,
    date: row.date,
    name: row.class_name,
    label,
    title,
    materials: materialsByClass[row.class_id] || [],
  }
  for (const material of cls.materials) {
    material.classLabel = label || 'Class'
    material.classTitle = title
    material.weekNumber = cls.weekNumber
    material.classDate = cls.date
  }
  if (!classesByCourse[row.course_id]) classesByCourse[row.course_id] = []
  classesByCourse[row.course_id].push(cls)
}

const courses = parseRows(coursesCsv).map((row) => {
  const classes = (classesByCourse[row.course_id] || []).slice().sort(
    (a, b) => String(a.date).localeCompare(String(b.date)) || a.classId.localeCompare(b.classId),
  )
  const course = {
    courseId: row.course_id,
    name: row.name,
    shortDescription: row.short_description,
    longDescription: row.long_description,
    numberOfClasses: Number(row.number_of_classes) || classes.length,
    numberOfWeeks: Number(row.number_of_weeks) || 0,
    imageUrl: row.image_url,
    instructor: instructorsById[row.instructor_id] || null,
    classes,
  }
  course.materialCount = classes.reduce((count, cls) => count + cls.materials.length, 0)
  course.searchText = [
    course.courseId,
    course.name,
    course.shortDescription,
    course.longDescription,
    course.instructor ? course.instructor.name : '',
    classes.map((cls) => cls.name).join(' '),
  ]
    .join(' ')
    .toLowerCase()
  return course
})

const allDates = courses.flatMap((course) => course.classes.map((cls) => cls.date)).filter(Boolean).sort()
let term = ''
if (allDates.length) {
  const first = new Date(`${allDates[0]}T00:00:00`)
  if (!Number.isNaN(first.getTime())) term = `${seasonName(first.getMonth() + 1)} ${first.getFullYear()}`
}

const weekdayFormat = new Intl.DateTimeFormat('en-US', { weekday: 'short' })
const dayFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })

function toDate(iso) {
  const date = new Date(`${iso}T00:00:00`)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatWeekday(iso) {
  const date = toDate(iso)
  return date ? weekdayFormat.format(date) : String(iso || '')
}

export function formatDay(iso) {
  const date = toDate(iso)
  return date ? dayFormat.format(date) : String(iso || '')
}

export const PLATFORM = {
  courses,
  coursesById: Object.fromEntries(courses.map((course) => [course.courseId, course])),
  instructors,
  term,
  totals: {
    courses: courses.length,
    classes: courses.reduce((count, course) => count + course.classes.length, 0),
    instructors: instructors.length,
    weekOptions: [...new Set(courses.map((course) => course.numberOfWeeks))].sort((a, b) => a - b),
  },
}
