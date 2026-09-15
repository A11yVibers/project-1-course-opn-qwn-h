import { IconCalendar, IconStack, IconDoc } from './Icons.jsx'

export default function CourseCard({ course }) {
  const { instructor } = course
  return (
    <a className="course-card" href={`#/courses/${course.course_id}`} aria-label={`Open course ${course.name}`}>
      <div className="card-media">
        <img src={course.image_url} alt="" loading="lazy" />
        <span className="card-code">{course.course_id}</span>
        {course.material_count > 0 && (
          <span className="card-flag">
            <IconDoc /> {course.material_count} materials ready
          </span>
        )}
      </div>
      <div className="card-body">
        <h2 className="card-title">{course.name}</h2>
        <p className="card-desc">{course.short_description}</p>
        {instructor && (
          <div className="card-instructor">
            <img className="avatar" src={instructor.photo_url} alt="" loading="lazy" />
            <span>{instructor.name}</span>
          </div>
        )}
        <div className="card-meta">
          <span>
            <IconCalendar /> {course.number_of_weeks} weeks
          </span>
          <span>
            <IconStack /> {course.number_of_classes} classes
          </span>
        </div>
      </div>
    </a>
  )
}
