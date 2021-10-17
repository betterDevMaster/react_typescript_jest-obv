import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import {MenuItemActionProps} from 'organization/Event/AttendeeManagement/AttendeeTools'
import {useEvent} from 'Event/EventProvider'

export default function ImportMailchimpAudienceMenuItem(
  props: MenuItemActionProps,
) {
  const {event} = useEvent()

  if (!event.has_mailchimp) {
    return null
  }

  return (
    <MenuItem disabled={props.disabled} onClick={props.onClick}>
      Import Audience
    </MenuItem>
  )
}
