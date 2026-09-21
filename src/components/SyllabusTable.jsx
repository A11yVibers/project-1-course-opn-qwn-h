import { formatWeekday, formatDay, typeMeta } from '../data/platform.js'
import { MaterialTypeIcon } from './icons.jsx'

export default function SyllabusTable({ course, selectedMaterialId, onSelectMaterial }) {
  const weeks = []
  for (const cls of course.classes) {
    const last = weeks[weeks.length - 1]
    if (last && last.week === cls.weekNumber) last.classes.push(cls)
    else weeks.push({ week: cls.weekNumber, classes: [cls] })
  }

  return (
    <div className="syllabus-scroll">
      <table className="syllabus">
        <caption className="visually-hidden">
          Weekly schedule and class materials for {course.name}
        </caption>
        <thead>
          <tr>
            <th scope="col" className="syllabus__col-week">
              Week
            </th>
            <th scope="col" className="syllabus__col-date">
              Date
            </th>
            <th scope="col">Class content</th>
          </tr>
        </thead>
        <tbody>
          {weeks.map((weekGroup) =>
            weekGroup.classes.map((cls, index) => (
              <tr key={cls.classId}>
                {index === 0 && (
                  <td className="syllabus__week" rowSpan={weekGroup.classes.length}>
                    <span className="week-badge" aria-hidden="true">
                      {weekGroup.week}
                    </span>
                    <span className="visually-hidden">Week {weekGroup.week}</span>
                  </td>
                )}
                <td className="syllabus__date">
                  <span className="syllabus__weekday">{formatWeekday(cls.date)}</span>
                  <span className="syllabus__day">{formatDay(cls.date)}</span>
                </td>
                <th scope="row" className="syllabus__content">
                  <div className="class-head">
                    {cls.label && <span className="class-badge">{cls.label}</span>}
                    <span className="class-title">{cls.title}</span>
                  </div>
                  {cls.materials.length > 0 ? (
                    <ul className="material-list">
                      {cls.materials.map((material) => {
                        const selected = material.materialId === selectedMaterialId
                        const meta = typeMeta(material.type)
                        return (
                          <li key={material.materialId}>
                            <button
                              type="button"
                              className={selected ? 'material-btn material-btn--selected' : 'material-btn'}
                              aria-pressed={selected}
                              onClick={() => onSelectMaterial(material)}
                            >
                              <MaterialTypeIcon icon={meta.icon} width={17} height={17} />
                              <span className="material-btn__title">{material.title}</span>
                              <span className="material-btn__type">{meta.label}</span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  ) : (
                    <p className="material-empty">Materials will be posted before class.</p>
                  )}
                </th>
              </tr>
            )),
          )}
        </tbody>
      </table>
    </div>
  )
}
