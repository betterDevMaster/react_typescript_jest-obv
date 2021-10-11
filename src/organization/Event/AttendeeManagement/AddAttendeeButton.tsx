import Button, {ButtonProps} from '@material-ui/core/Button'
import {
  UPDATE_ATTENDEES,
  usePermissions,
} from 'organization/PermissionsProvider'
import React from 'react'

export default function AddAttendeeButton(props: ButtonProps) {
  const {can} = usePermissions()
  if (!can(UPDATE_ATTENDEES)) {
    return null
  }

  return (
    <Button {...props} variant="contained" color="primary">
      Add Attendee
    </Button>
  )
}
