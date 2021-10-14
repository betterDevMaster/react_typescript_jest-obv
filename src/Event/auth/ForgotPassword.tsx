import React from 'react'
import SimpleBlogForgotPassword from 'Event/template/SimpleBlog/Login/ForgotPassword'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {useEvent} from 'Event/EventProvider'
import {eventRoutes} from 'Event/Routes'
import {useForgotPassword} from 'auth/password'
import {api} from 'lib/url'
import {useTemplate} from 'Event/TemplateProvider'
import {PANELS} from 'Event/template/Panels'
import PanelsForgotPassword from 'Event/template/Panels/Login/ForgotPassword'
import {CARDS} from 'Event/template/Cards'
import CardsForgotPassword from 'Event/template/Cards/Login/ForgotPassword'

export default function ForgotPassword() {
  const {name} = useTemplate()

  const {url: eventUrl, event} = useEvent()

  const forgotPassword = useForgotPassword({
    url: api(`/events/${event.slug}/forgot_password`),
    resetFormUrl: `${eventUrl}${eventRoutes.resetPassword}`,
  })

  switch (name) {
    case SIMPLE_BLOG:
      return <SimpleBlogForgotPassword {...forgotPassword} />
    case PANELS:
      return <PanelsForgotPassword {...forgotPassword} />
    case CARDS:
      return <CardsForgotPassword {...forgotPassword} />
    default:
      throw new Error(`Missing forgot password page for template: ${name}`)
  }
}
