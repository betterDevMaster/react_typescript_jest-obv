import React from 'react'

import {useTemplate} from 'Event/TemplateProvider'
import {RoomRegistrationData} from 'Event/RoomRegistration'

import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import SimpleBlogRoomRegistrationForm from 'Event/template/SimpleBlog/RoomRegistrationForm'
import {PANELS} from 'Event/template/Panels'
import PanelsRoomRegistrationForm from 'Event/template/Panels/RoomRegistrationForm'
import {CARDS} from 'Event/template/Cards'
import CardsRoomRegistrationForm from 'Event/template/Cards/RoomRegistrationForm'
import {FIFTY_BLOG} from 'Event/template/FiftyBlog'
import FiftyBlogRoomRegistrationForm from 'Event/template/FiftyBlog/RoomRegistrationForm'

import {ValidationError} from 'lib/ui/api-client'

export interface RoomRegistrationFormProps {
  submit: (data: RoomRegistrationData) => void
  canSubmit: boolean
  responseError: ValidationError<RoomRegistrationData>
}

export default function TemplateRoomRegistrationForm(
  props: RoomRegistrationFormProps,
) {
  const {name} = useTemplate()

  switch (name) {
    case SIMPLE_BLOG:
      return <SimpleBlogRoomRegistrationForm {...props} />
    case PANELS:
      return <PanelsRoomRegistrationForm {...props} />
    case CARDS:
      return <CardsRoomRegistrationForm {...props} />
    case FIFTY_BLOG:
      return <FiftyBlogRoomRegistrationForm {...props} />
    default:
      throw new Error(`Missing room registration form for template: ${name}`)
  }
}
