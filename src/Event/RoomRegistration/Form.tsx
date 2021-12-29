import React from 'react'

import {useTemplate} from 'Event/TemplateProvider'
import {RoomRegistrationData} from 'Event/RoomRegistration'

import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import SimpleBlogRoomRegistrationForm from 'Event/template/SimpleBlog/RoomRegistrationForm'
import {PANELS} from 'Event/template/Panels'
import PanelsRoomRegistrationForm from 'Event/template/Panels/RoomRegistrationForm'
import {CARDS} from 'Event/template/Cards'
import CardsRoomRegistrationForm from 'Event/template/Cards/RoomRegistrationForm'
import {NIFTY_FIFTY} from 'Event/template/NiftyFifty'
import NiftyFiftyRoomRegistrationForm from 'Event/template/NiftyFifty/RoomRegistrationForm'

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
    case NIFTY_FIFTY:
      return <NiftyFiftyRoomRegistrationForm {...props} />
    default:
      throw new Error(`Missing room registration form for template: ${name}`)
  }
}
