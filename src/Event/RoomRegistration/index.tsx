import React, {useState} from 'react'
import Form from 'Event/RoomRegistration/Form'
import {useTrackEventPage} from 'analytics'
import {Redirect} from 'react-router-dom'
import {eventRoutes} from 'Event/Routes'
import {api, useQueryParams} from 'lib/url'
import {Attendee} from 'Event/attendee'
import {FETCH_JOIN_URL_INTERVAL_MS, useEvent} from 'Event/EventProvider'
import {ValidationError} from 'lib/api-client'

export interface RoomRegistrationData {
  first_name: string
  last_name: string
  email: string
}

export default function RoomRegistration() {
  useTrackEventPage({
    page: 'Room Registration',
  })

  const [submitting, setSubmitting] = useState(false)
  const [responseError, setResponseError] = useState<
    ValidationError<RoomRegistrationData>
  >(null)

  const {client} = useEvent()
  const {token} = useQueryParams()

  const canSubmit = !submitting

  if (!token) {
    return <Redirect to={eventRoutes.login} />
  }

  const submit = (data: RoomRegistrationData) => {
    setSubmitting(true)

    const withToken = {
      ...data,
      token,
    }

    setResponseError(null)

    return client
      .post<{url: string; attendee: Attendee} | null>(
        api('/room/join'),
        withToken,
      )
      .then((resData) => {
        if (!resData) {
          /**
           * Join URL is NOT ready yet so we'll re-submit
           */
          setTimeout(() => submit(data), FETCH_JOIN_URL_INTERVAL_MS)
          return
        }

        window.location.href = resData.url
      })
      .catch((e) => {
        setSubmitting(false)
        setResponseError(e)
      })
  }

  return (
    <Form submit={submit} canSubmit={canSubmit} responseError={responseError} />
  )
}
