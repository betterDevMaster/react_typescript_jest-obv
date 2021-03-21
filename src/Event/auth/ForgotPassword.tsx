import React from 'react'
import {useTemplate} from 'Event/TemplateProvider'
import SimpleBlogForgotPassword from 'Event/template/SimpleBlog/Login/ForgotPassword'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'

import {useEvent} from 'Event/EventProvider'
import {eventRoutes} from 'Event/Routes'
import {useForgotPassword} from 'auth/password'
import {api} from 'lib/url'

export default function ForgotPassword() {
  const template = useTemplate()

  const {url: eventUrl, event} = useEvent()

  const forgotPassword = useForgotPassword({
    url: api(`/events/${event.slug}/forgot_password`),
    resetFormUrl: `${eventUrl}${eventRoutes.reset_password}`,
  })

  switch (template.name) {
    case SIMPLE_BLOG:
      return <SimpleBlogForgotPassword {...forgotPassword} />
    default:
      throw new Error(`Missing login for template: ${template.name}`)
  }
}
