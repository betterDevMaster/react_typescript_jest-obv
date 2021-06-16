import {useEvent} from 'Event/EventProvider'
import React, {useState} from 'react'
import {api} from 'lib/url'
import {Attendee} from 'Event/attendee'
import {ValidationError} from 'lib/api-client'
import {setUser} from 'auth/actions'
import {useDispatch} from 'react-redux'
import {useTemplate} from 'Event/TemplateProvider'
import {useAttendee} from 'Event/auth'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import SimpleBlogSetPasswordForm from 'Event/template/SimpleBlog/Step1/SetPasswordForm'
import PanelsSetPasswordForm from 'Event/template/Panels/Step1/SetPasswordForm'
import {usePoints} from 'Event/PointsProvider'
import {usePlatformActions} from 'Event/ActionsProvider/platform-actions'
import {User} from 'auth/user'
import {PANELS} from 'Event/template/Panels'

interface SetPasswordData {
  password: string
  password_confirmation: string
}

export interface SetPasswordFormProps {
  submit: (data: SetPasswordData) => void
  submitting: boolean
  responseError: ValidationError<SetPasswordData>
  progress: number
  user: User
}

export default function SetPasswordForm() {
  const {hasTechCheck} = useEvent()
  const [submitting, setSubmitting] = useState(false)
  const [responseError, setResponseError] = useState<
    SetPasswordFormProps['responseError']
  >(null)
  const setPassword = useSetPassword()
  const dispatch = useDispatch()
  const {submit: submitAction} = usePoints()
  const {createPassword: CREATE_PASSWORD} = usePlatformActions()
  const progress = hasTechCheck ? 25 : 33
  const user = useAttendee()

  const submit = (data: SetPasswordData) => {
    setSubmitting(true)
    setPassword(data)
      .then((attendee) => {
        dispatch(setUser(attendee))
        submitAction(CREATE_PASSWORD)
      })
      .catch((e) => {
        setResponseError(e)
        setSubmitting(false)
      })
  }

  return (
    <TemplateSetPasswordForm
      user={user}
      submit={submit}
      submitting={submitting}
      responseError={responseError}
      progress={progress}
    />
  )
}

export function TemplateSetPasswordForm(props: SetPasswordFormProps) {
  const template = useTemplate()

  switch (template.name) {
    case SIMPLE_BLOG:
      return <SimpleBlogSetPasswordForm {...props} />
    case PANELS:
      return <PanelsSetPasswordForm {...props} />
    default:
      throw new Error(`Missing set password form for template.`)
  }
}

function useSetPassword() {
  const {event, client} = useEvent()
  const url = api(`/events/${event.slug}/password`)

  return (data: SetPasswordData) => client.post<Attendee>(url, data)
}
