import {useEvent} from 'Event/EventProvider'
import React, {useEffect, useState} from 'react'

export interface Question {
  id: number
  label: string
  helper_text: string | null
  is_required: boolean
  allows_multiple_options: boolean
  type: QuestionType
  options: string[]
  validation_rule: string | null
  is_registration_question: boolean
}

/**
 * Question types
 */

export const SHORT_ANSWER_TEXT = 'short_answer_text'
export const LONG_ANSWER_TEXT = 'long_answer_text'
export const RADIO = 'radio'
export const SELECT = 'select'
export const CHECKBOX = 'checkbox'

export type QuestionType =
  | typeof SHORT_ANSWER_TEXT
  | typeof LONG_ANSWER_TEXT
  | typeof RADIO
  | typeof SELECT
  | typeof CHECKBOX

/**
 * Validation Rules
 */

export const EMAIL = 'email'
export const PHONE_NUMBER = 'phone_number'
export const ALPHA_NUMERIC = 'alpha_numeric'
export const NUMERIC = 'numeric'

export interface QuestionsContextProps {
  questions: Question[]
  add: (question: Question) => void
  update: (question: Question) => void
  remove: (question: Question) => void
}

export const QuestionsContext = React.createContext<
  QuestionsContextProps | undefined
>(undefined)

export default function QuestionsProvider(props: {
  children: React.ReactElement
}) {
  const [questions, setQuestions] = useState<Question[]>([])
  const {event} = useEvent()

  useEffect(() => {
    setQuestions(event.questions)
  }, [event])

  const add = (question: Question) => {
    const added = [...questions, question]
    setQuestions(added)
  }

  const update = (target: Question) => {
    const updated = questions.map((q) => {
      const isTarget = q.id === target.id
      if (isTarget) {
        return target
      }

      return q
    })

    setQuestions(updated)
  }

  const remove = (target: Question) => {
    const remaining = questions.filter((q) => q.id !== target.id)
    setQuestions(remaining)
  }

  return (
    <QuestionsContext.Provider value={{questions, add, update, remove}}>
      {props.children}
    </QuestionsContext.Provider>
  )
}

export function useQuestions() {
  const context = React.useContext(QuestionsContext)
  if (context === undefined) {
    throw new Error(`useQuestions must be used within a QuestionsProvider`)
  }

  return context
}

export function registrationOnly(questions: Question[]) {
  return questions.filter((q) => q.is_registration_question)
}