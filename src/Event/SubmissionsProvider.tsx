import {useEvent} from 'Event/EventProvider'
import {ValidationError} from 'lib/api-client'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {Form} from 'organization/Event/FormsProvider'
import React, {useCallback, useEffect, useState} from 'react'

export interface Answer {
  question_id: number
  value: string
}

interface SubmissionsContextProps {
  submit: (form: Form, answers: Answer[]) => Promise<void>
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

  const submit = useSubmit()

  const onSubmit = (form: Form, data: Answer[]) => {
    setResponseError(null)

    return submit(form, data)
      .then((newAnswers) => {
        const existing = answers.filter(
          (a) => !newAnswers.find((na) => na.question_id === a.question_id),
        )

        const updated = [...existing, ...newAnswers]
        setAnswers(updated)
      })
      .catch((e) => {
        setResponseError(e)

        /**
         * Re-throw error in case there's a request expecting this
         * to success (ie. submitting waiver).
         */

        throw e
      })
  }

  useEffect(() => {
    if (!fetchedAnswers) {
      return
    }

    setAnswers(fetchedAnswers)
  }, [fetchedAnswers])

  if (loading) {
    return <div>loading...</div>
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
        submit: (_form: Form, _answers: Answer[]) => Promise.resolve(),
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

  return (form: Form, data: Answer[]) => {
    const url = api(`/forms/${form.id}/submissions`)
    return client.post<Answer[]>(url, data)
  }
}

export function useSubmissions() {
  const context = React.useContext(SubmissionsContext)
  if (context === undefined) {
    throw new Error('useSubmissions must be used within a SubmissionsProvider')
  }

  return context
}
