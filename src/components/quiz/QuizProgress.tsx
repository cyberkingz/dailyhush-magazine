interface QuizProgressProps {
  current: number
  total: number
  section?: string
}

export function QuizProgress({ current, total, section }: QuizProgressProps) {
  const percentage = Math.round((current / total) * 100)

  return (
    <div className="quiz-progress" role="progressbar" aria-valuenow={current} aria-valuemin={1} aria-valuemax={total} aria-label="Quiz progress">
      <div className="quiz-progress__bar-container">
        <div
          className="quiz-progress__bar"
          style={{ width: `${percentage}%` }}
          aria-hidden="true"
        />
      </div>
      <div className="quiz-progress__info">
        <span className="quiz-progress__text">
          Question {current} of {total}
        </span>
        {section && (
          <span className="quiz-progress__section">{section}</span>
        )}
      </div>
    </div>
  )
}
