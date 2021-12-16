import React, {useState} from 'react'
import {useDispatch} from 'react-redux'

import {User} from 'auth/user'

import {Attendee} from 'Event/attendee'
import {useAttendee} from 'Event/auth'
import {usePoints} from 'Event/PointsProvider'
import {usePlatformActions} from 'Event/ActionsProvider/platform-actions'
import {useEvent} from 'Event/EventProvider'
import {setUser} from 'auth/actions'
import {useTemplate} from 'Event/TemplateProvider'

import SimpleBlogSetPasswordForm from 'Event/template/SimpleBlog/Step1/SetPasswordForm'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import PanelsSetPasswordForm from 'Event/template/Panels/Step1/SetPasswordForm'
import {PANELS} from 'Event/template/Panels'
import CardsSetPasswordForm from 'Event/template/Cards/Step1/SetPasswordForm'
import {CARDS} from 'Event/template/Cards'
import FiftyBlogSetPasswordForm from 'Event/template/FiftyBlog/Step1/SetPasswordForm'
import {FIFTY_BLOG} from 'Event/template/FiftyBlog'

import {ValidationError} from 'lib/ui/api-client'
import {api} from 'lib/url'

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
  const [submitting, setSubmitting] = useState(false)
  const [responseError, setResponseError] = useState<
    SetPasswordFormProps['responseError']
  >(null)
  const setPassword = useSetPassword()
  const dispatch = useDispatch()
  const {submit: submitAction} = usePoints()
  const {createPassword: CREATE_PASSWORD} = usePlatformActions()
  const progress = useStep1Progress()
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

function useStep1Progress() {
  const {hasTechCheck, hasWaiver} = useEvent()

  if (hasTechCheck && hasWaiver) {
    return 25
  }

  if (!hasTechCheck && !hasWaiver) {
    return 50
  }

  return 33
}

export function TemplateSetPasswordForm(props: SetPasswordFormProps) {
  const template = useTemplate()

  switch (template.name) {
    case SIMPLE_BLOG:
      return <SimpleBlogSetPasswordForm {...props} />
    case PANELS:
      return <PanelsSetPasswordForm {...props} />
    case CARDS:
      return <CardsSetPasswordForm {...props} />
    case FIFTY_BLOG:
      return <FiftyBlogSetPasswordForm {...props} />
    default:
      throw new Error(`Missing set password form for template.`)
  }
}

function useSetPassword() {
  const {event, client} = useEvent()
  const url = api(`/events/${event.slug}/password`)

  return (data: SetPasswordData) => client.post<Attendee>(url, data)
}
