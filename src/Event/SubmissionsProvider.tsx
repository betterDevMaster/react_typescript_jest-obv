import {useActions} from 'Event/ActionsProvider'
import {useEvent} from 'Event/EventProvider'
import {usePoints} from 'Event/PointsProvider'
import {ValidationError} from 'lib/ui/api-client'
import {useAsync} from 'lib/async'
import FullPageLoader from 'lib/ui/layout/FullPageLoader'
import {api} from 'lib/url'
import {Form} from 'organization/Event/FormsProvider'
import {Question} from 'organization/Event/QuestionsProvider'
import React, {useCallback, useEffect, useState} from 'react'

export interface Answer {
  question_id: number
  value: string
  form_id: number
}

interface SubmissionsContextProps {
  submit: (form: Form, data: {answers: Answer[]}) => Promise<void>
  answers: Answer[]
  responseError: ValidationError<any> | null
}

export const SubmissionsContext = React.createContext<
  undefined | SubmissionsContextProps
>(undefined)

export default function SubmissionsProvider(props: {
  children: React.ReactElement
}) {
  const [answers, setAnswers] = useState<Answer[]>([])
  const {loading, data: fetchedAnswers} = useAnswers()
  const [
    responseError,
    setResponseError,
  ] = useState<ValidationError<any> | null>(null)
  const {submit: submitAction} = usePoints()
  const submitOptionActions = useSubmitOptionActions()

  useEffect(() => {
    if (!fetchedAnswers) {
      return
    }

    setAnswers(fetchedAnswers)
  }, [fetchedAnswers])

  const submit = useSubmit()

  const onSubmit = (form: Form, data: {answers: Answer[]}) => {
    setResponseError(null)

    return submit(form, data)
      .then((newAnswers) => {
        /**
         * Update the answers that's been submitted...
         */
        const existing = answers.filter(
          (a) => !newAnswers.find((na) => na.question_id === a.question_id),
        )

        const updated = [...existing, ...newAnswers]
        setAnswers(updated)

        /**
         * Submit Form action
         */
        if (form.action) {
          submitAction(form.action)
        }

        submitOptionActions(form, newAnswers)
      })
      .catch((e) => {
        setResponseError(e)
        throw e // Re-throw to avoid the form thinking it was a success
      })
  }

  if (loading) {
    return <FullPageLoader />
  }

  return (
    <SubmissionsContext.Provider
      value={{submit: onSubmit, answers, responseError}}
    >
      {props.children}
    </SubmissionsContext.Provider>
  )
}

export function StaticSubmissionsProvider(props: {
  answers?: Answer[]
  children: React.ReactNode
}) {
  return (
    <SubmissionsContext.Provider
      value={{
        answers: props.answers || [],
        responseError: null,
        submit: (_form: Form, _answers: {answers: Answer[]}) =>
          Promise.resolve(),
      }}
    >
      {props.children}
    </SubmissionsContext.Provider>
  )
}

function useAnswers() {
  const {client, event} = useEvent()
  const url = api(`/events/${event.slug}/submissions`)

  const request = useCallback(() => client.get<Answer[]>(url), [client, url])
  return useAsync(request)
}

function useSubmit() {
  const {client} = useEvent()

  return (form: Form, data: {answers: Answer[]}) => {
    const url = api(`/forms/${form.id}/submissions`)
    return client.post<Answer[]>(url, data)
  }
}

/**
 * Submit option actions (correct answers)
 */
function useSubmitOptionActions() {
  const {actions} = useActions()
  const {submit: submitAction} = usePoints()

  return (form: Form, answers: Answer[]) => {
    for (const question of form.questions) {
      const hasOptions = question.options.length > 0
      if (!hasOptions) {
        continue
      }

      const answer = answers.find((a) => a.question_id === question.id)
      if (!answer) {
        continue
      }

      const selectedOption = question.options.find(
        (o) => o.value === answer.value,
      )

      if (!selectedOption || !selectedOption.action_id) {
        continue
      }

      const action = actions.find((a) => a.id === selectedOption.action_id)
      if (!action) {
        return
      }

      submitAction(action)
    }
  }
}

export function useSubmissions() {
  const context = React.useContext(SubmissionsContext)
  if (context === undefined) {
    throw new Error('useSubmissions must be used within a SubmissionsProvider')
  }

  return context
}

export function findAnswer(question: Question, answers?: Answer[]) {
  if (!answers) {
    return null
  }

  const answer = answers.find((a) => a.question_id === question.id)
  if (!answer) {
    return null
  }

  return answer.value
}

/**
 * Checks whether a particular form has been submitted.
 * @param answers
 * @param form
 * @returns
 */
export function hasSubmittedForm(answers: Answer[], form: Form) {
  /**
   * Answers could contain submissions from several forms so we need
   * to see if there are any relevant to this form.
   */
  const numSubmitted = form.questions.filter((q) =>
    Boolean(findAnswer(q, answers)),
  ).length

  return numSubmitted > 0
}
