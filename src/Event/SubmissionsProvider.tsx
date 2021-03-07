import {useEvent} from 'Event/EventProvider'
import {ValidationError} from 'lib/api-client'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import React, {useCallback, useEffect, useState} from 'react'

export interface Answer {
  question_id: number
  value: string
}

interface SubmissionsContextProps {
  submit: (answers: Answer[]) => Promise<void>
  answers: Answer[]
  responseError: ValidationError<any> | null
}

const SubmissionsContext = React.createContext<
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

  const addAnswers = (newAnswers: Answer[]) => {
    const added = [...answers, ...newAnswers]
    setAnswers(added)
  }

  const submit = useSubmit(addAnswers, setResponseError)

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
    <SubmissionsContext.Provider value={{submit, answers, responseError}}>
      {props.children}
    </SubmissionsContext.Provider>
  )
}

function useAnswers() {
  const {client, event} = useEvent()
  const url = api(`/events/${event.slug}/questions/submissions`)

  const request = useCallback(() => client.get<Answer[]>(url), [client, url])
  return useAsync(request)
}

function useSubmit(
  addAnswers: (answers: Answer[]) => void,
  setResponseError: (error: ValidationError<any> | null) => void,
) {
  const {client, event} = useEvent()
  const url = api(`/events/${event.slug}/questions/submissions`)

  return (data: Answer[]) => {
    setResponseError(null)
    return client
      .post<Answer[]>(url, data)
      .then(addAnswers)
      .catch((e) => {
        setResponseError(e)
        /**
         * Re-throw error in case there's a request expecting this
         * to success (ie. submitting waiver).
         */
        throw e
      })
  }
}

export function useSubmissions() {
  const context = React.useContext(SubmissionsContext)
  if (context === undefined) {
    throw new Error('useSubmissions must be used within a SubmissionsProvider')
  }

  return context
}
