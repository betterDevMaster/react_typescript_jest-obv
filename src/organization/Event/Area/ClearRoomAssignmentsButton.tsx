import React from 'react'
import Box from '@material-ui/core/Box'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import {useEvent} from 'Event/EventProvider'
import DangerButton from 'lib/ui/Button/DangerButton'
import ConfirmDialog from 'lib/ui/ConfirmDialog'
import {Area} from 'organization/Event/AreasProvider'
import {useToggle} from 'lib/toggle'

export default function ClearRoomAssignmentsButton(props: {
  area: Area
  onError: (error: string) => void
  clearError: () => void
}) {
  const {event} = useEvent()
  const url = api(
    `/events/${event.slug}/areas/${props.area.id}/room_assignments`,
  )
  const {client} = useOrganization()
  const {flag: processing, toggle: toggleProcessing} = useToggle()

  const resetRooms = () => {
    if (processing) {
      return
    }
    props.clearError()

    toggleProcessing()

    client
      .delete(url)
      .catch((e) => {
        props.onError(`Could not reset room assignments. ${e.message}`)
      })
      .finally(toggleProcessing)
  }
  return (
    <Box mb={2}>
      <ConfirmDialog
        onConfirm={resetRooms}
        description={`You're about to clear all your room assignments for ${props.area.name}.  This cannot be un-done.  Are you sure you want to continue?`}
      >
        {(confirm) => (
          <DangerButton
            onClick={confirm}
            disabled={processing}
            variant="outlined"
            aria-label="clear room assignments"
          >
            Clear Room Assignments
          </DangerButton>
        )}
      </ConfirmDialog>
    </Box>
  )
}
