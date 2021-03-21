import React from 'react'
import {UseFormMethods} from 'react-hook-form'
import {useTemplate} from 'Event/TemplateProvider'
import SimpleBlogResetPassword from 'Event/template/SimpleBlog/Login/ResetPassword'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'

import {eventRoutes} from 'Event/Routes'
import {useHistory} from 'react-router-dom'
import {ValidationError} from 'lib/api-client'
import {useResetPassword} from 'auth/password'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'

interface ResetPasswordData {
  email: string
  password: string
  password_confirmation: string
}

export interface ResetPasswordProps {
  onSubmit: () => void
  goBacktoLogin: () => void
  register: UseFormMethods['register']
  submitting: boolean
  wasSuccessful: boolean
  responseError: ValidationError<ResetPasswordData>
  email?: string
  errors: {
    email?: string
    password?: string
    passwordConfirmation?: string
  }
}

export default function ResetPassword() {
  const template = useTemplate()

  const history = useHistory()
  const goBacktoLogin = () => {
    history.push(eventRoutes.login)
  }

  const {event} = useEvent()
  const reset = useResetPassword(api(`/events/${event.slug}/reset_password`))

  switch (template.name) {
    case SIMPLE_BLOG:
      return (
        <SimpleBlogResetPassword goBacktoLogin={goBacktoLogin} {...reset} />
      )
    default:
      throw new Error(`Missing login for template: ${template.name}`)
  }
}
