import React from 'react'
import SimpleBlogResetPassword from 'Event/template/SimpleBlog/Login/ResetPassword'
import PanelsResetPassword from 'Event/template/Panels/Login/ResetPassword'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {eventRoutes} from 'Event/Routes'
import {useHistory} from 'react-router-dom'
import {useResetPassword} from 'auth/password'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import {useTemplate} from 'Event/TemplateProvider'
import {PANELS} from 'Event/template/Panels'
import {CARDS} from 'Event/template/Cards'
import CardsResetPassword from 'Event/template/Cards/Login/ResetPassword'

export default function ResetPassword() {
  const {name} = useTemplate()

  const history = useHistory()
  const goBacktoLogin = () => {
    history.push(eventRoutes.login)
  }

  const {event} = useEvent()
  const reset = useResetPassword(api(`/events/${event.slug}/reset_password`))

  switch (name) {
    case SIMPLE_BLOG:
      return (
        <SimpleBlogResetPassword goBacktoLogin={goBacktoLogin} {...reset} />
      )
    case PANELS:
      return <PanelsResetPassword goBacktoLogin={goBacktoLogin} {...reset} />
    case CARDS:
      return <CardsResetPassword goBacktoLogin={goBacktoLogin} {...reset} />
    default:
      throw new Error(`Missing reset password page for template: ${name}`)
  }
}
