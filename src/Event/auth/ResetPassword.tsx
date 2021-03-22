import React from 'react'
import {useTemplate} from 'Event/TemplateProvider'
import SimpleBlogResetPassword from 'Event/template/SimpleBlog/Login/ResetPassword'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'

import {eventRoutes} from 'Event/Routes'
import {useHistory} from 'react-router-dom'
import {useResetPassword} from 'auth/password'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'

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
