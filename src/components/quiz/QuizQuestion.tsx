import type {
  QuizQuestion as QuizQuestionType,
  QuizAnswer,
} from '../../types/quiz'

interface QuizQuestionProps {
  question: QuizQuestionType
  answer?: QuizAnswer
  onAnswer: (answer: QuizAnswer) => void
}

export function QuizQuestion({ question, answer, onAnswer }: QuizQuestionProps) {
  const handleSingleChoice = (optionId: string) => {
    onAnswer({
      questionId: question.id,
      optionId,
    })
  }

  const handleScaleChoice = (value: number) => {
    onAnswer({
      questionId: question.id,
      scaleValue: value,
    })
  }

  const handleMultipleChoice = (optionId: string) => {
    const currentIds = answer?.multipleOptionIds || []
    const newIds = currentIds.includes(optionId)
      ? currentIds.filter((id) => id !== optionId)
      : [...currentIds, optionId]

    onAnswer({
      questionId: question.id,
      multipleOptionIds: newIds,
    })
  }

  return (
    <div className="quiz-question">
      <h2 className="quiz-question__title">{question.question}</h2>
      {question.description && (
        <p className="quiz-question__description">{question.description}</p>
      )}

      <div className="quiz-question__options">
        {question.type === 'single' && question.options && (
          <div className="quiz-options quiz-options--single">
            {question.options.map((option) => (
              <button
                key={option.id}
                className={`quiz-option ${
                  answer?.optionId === option.id ? 'quiz-option--selected' : ''
                }`}
                onClick={() => handleSingleChoice(option.id)}
              >
                <span className="quiz-option__text">{option.text}</span>
              </button>
            ))}
          </div>
        )}

        {question.type === 'multiple' && question.options && (
          <div className="quiz-options quiz-options--multiple">
            {question.options.map((option) => (
              <button
                key={option.id}
                className={`quiz-option ${
                  answer?.multipleOptionIds?.includes(option.id)
                    ? 'quiz-option--selected'
                    : ''
                }`}
                onClick={() => handleMultipleChoice(option.id)}
              >
                <span className="quiz-option__checkbox">
                  {answer?.multipleOptionIds?.includes(option.id) ? '✓' : ''}
                </span>
                <span className="quiz-option__text">{option.text}</span>
              </button>
            ))}
          </div>
        )}

        {question.type === 'scale' &&
          question.scaleMin !== undefined &&
          question.scaleMax !== undefined && (
            <div className="quiz-scale">
              {question.scaleLabels && (
                <div className="quiz-scale__labels">
                  <span className="quiz-scale__label quiz-scale__label--min">
                    {question.scaleLabels.min}
                  </span>
                  <span className="quiz-scale__label quiz-scale__label--max">
                    {question.scaleLabels.max}
                  </span>
                </div>
              )}
              <div className="quiz-scale__buttons">
                {Array.from(
                  { length: question.scaleMax - question.scaleMin + 1 },
                  (_, i) => question.scaleMin! + i
                ).map((value) => (
                  <button
                    key={value}
                    className={`quiz-scale__button ${
                      answer?.scaleValue === value
                        ? 'quiz-scale__button--selected'
                        : ''
                    }`}
                    onClick={() => handleScaleChoice(value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  )
}
