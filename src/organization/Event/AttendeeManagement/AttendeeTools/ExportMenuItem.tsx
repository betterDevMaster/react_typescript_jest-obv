import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import {
  UPDATE_ATTENDEES,
  usePermissions,
} from 'organization/PermissionsProvider'
import {useAttendees} from 'organization/Event/AttendeesProvider'
import {useToggle} from 'lib/toggle'
import {MenuItemActionProps} from 'organization/Event/AttendeeManagement/AttendeeTools'

export default function ExportMenuItem(
  props: MenuItemActionProps & {onClick: () => void; disabled?: boolean},
) {
  const {can} = usePermissions()

  if (!can(UPDATE_ATTENDEES)) {
    /**
     * Already set a primary button
     */
    return null
  }

  return (
    <MenuItem onClick={props.onClick} disabled={props.disabled}>
      Export
    </MenuItem>
  )
}

export function useExportAttendees(
  onSuccess: (message: string | null) => void,
) {
  const {flag: processing, toggle: toggleProcessing} = useToggle()
  const {exportAttendees, clearError} = useAttendees()

  const process = () => {
    if (processing) {
      return
    }

    toggleProcessing()
    onSuccess(null)
    clearError()

    exportAttendees()
      .then((res) => {
        onSuccess(res.message)
      })
      .finally(toggleProcessing)
  }

  return {
    processing,
    exportAttendees: process,
  }
}
