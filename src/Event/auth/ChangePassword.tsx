import React from 'react'
import {useTemplate} from 'Event/TemplateProvider'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import SimpleBlogChangePassword from 'Event/template/SimpleBlog/Login/ChangePassword'
import CardsChangePassword from 'Event/template/Cards/Login/ChangePassword'
import {useChangePassword} from 'auth/password/change'
import {CARDS} from 'Event/template/Cards'

export default function ChangePassword() {
  const template = useTemplate()

  const {event, client} = useEvent()
  const changePassword = useChangePassword(
    client,
    api(`/events/${event.slug}/password`),
  )

  switch (template.name) {
    case SIMPLE_BLOG:
      return <SimpleBlogChangePassword changePassword={changePassword} />
    case CARDS:
      return <CardsChangePassword changePassword={changePassword} />
    default:
      throw new Error(
        `Missing change password page for template: ${template.name}`,
      )
  }
}
