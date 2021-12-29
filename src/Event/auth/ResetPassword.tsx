import React from 'react'
import {useHistory} from 'react-router-dom'

import {useEvent} from 'Event/EventProvider'
import {eventRoutes} from 'Event/Routes'
import {useTemplate} from 'Event/TemplateProvider'

import SimpleBlogResetPassword from 'Event/template/SimpleBlog/Login/ResetPassword'
import PanelsResetPassword from 'Event/template/Panels/Login/ResetPassword'
import NiftyFiftyResetPassword from 'Event/template/NiftyFifty/Login/ResetPassword'
import CardsResetPassword from 'Event/template/Cards/Login/ResetPassword'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {useResetPassword} from 'auth/password'
import {CARDS} from 'Event/template/Cards'
import {PANELS} from 'Event/template/Panels'
import {NIFTY_FIFTY} from 'Event/template/NiftyFifty'

import {api} from 'lib/url'

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
    case NIFTY_FIFTY:
      return (
        <NiftyFiftyResetPassword goBacktoLogin={goBacktoLogin} {...reset} />
      )
    default:
      throw new Error(`Missing reset password page for template: ${name}`)
  }
}
