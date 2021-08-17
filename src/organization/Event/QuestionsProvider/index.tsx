import {Form} from 'organization/Event/FormsProvider'
import React, {useEffect, useState} from 'react'

export interface Question {
  /**
   * ID can be a number (saved), or a string for an unsaved question
   * with a UUID
   */
  id: number | string
  label: string
  helper_text: string | null
  is_required: boolean
  allows_multiple_options: boolean
  type: QuestionType
  options: Option[]
  validation_rule: string | null
  has_other_option: boolean
  character_limit: number | null
  character_limit_error_message: string | null
  start_adornment: string | null
}

export interface Option {
  value: string
  action_id: null | number
}

/**
 * Question types
 */

export const SHORT_ANSWER_TEXT = 'short_answer_text'
export const LONG_ANSWER_TEXT = 'long_answer_text'
export const RADIO = 'radio'
export const SELECT = 'select'
export const CHECKBOX = 'checkbox'
export const CURRENCY = 'currency'

export type QuestionType =
  | typeof SHORT_ANSWER_TEXT
  | typeof LONG_ANSWER_TEXT
  | typeof RADIO
  | typeof SELECT
  | typeof CHECKBOX
  | typeof CURRENCY

/**
 * Validation Rules
 *
 * These types match up to the types defined at the API. We duplicate
 * them here assuming they rarely change, and this way we avoid
 * re-fetching types.
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
  setQuestions: (questions: Question[]) => void
}

export const QuestionsContext = React.createContext<
  QuestionsContextProps | undefined
>(undefined)

export default function QuestionsProvider(props: {
  children: React.ReactElement
  form: Form
}) {
  const [questions, setQuestions] = useState<Question[]>([])
  const {form} = props

  useEffect(() => {
    setQuestions(form.questions)
  }, [form])

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
    <QuestionsContext.Provider
      value={{questions, add, update, remove, setQuestions}}
    >
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
