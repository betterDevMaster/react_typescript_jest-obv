import React from 'react'
import Box from '@material-ui/core/Box'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import {useEvent} from 'Event/EventProvider'
import DangerButton from 'lib/ui/Button/DangerButton'
import ConfirmDialog from 'lib/ui/ConfirmDialog'
import {useToggle} from 'lib/toggle'
import {useArea} from 'organization/Event/Area/AreaProvider'

export default function ClearRoomAssignmentsButton(props: {
  onError: (error: string) => void
  clearError: () => void
}) {
  const {area} = useArea()

  const {clear, processing} = useClearRoomAssignments(
    props.clearError,
    props.onError,
  )
  return (
    <Box mb={2}>
      <ConfirmDialog
        onConfirm={clear}
        description={`You're about to clear all your room assignments for ${area.name}.  This cannot be un-done.  Are you sure you want to continue?`}
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

export function useClearRoomAssignments(
  clearError: () => void,
  onError: (error: string) => void,
) {
  const {area} = useArea()
  const {event} = useEvent()
  const url = api(`/events/${event.slug}/areas/${area.id}/room_assignments`)
  const {client} = useOrganization()
  const {flag: processing, toggle: toggleProcessing} = useToggle()

  const clear = () => {
    if (processing) {
      return
    }
    clearError()

    toggleProcessing()

    client
      .delete(url)
      .catch((e) => {
        onError(`Could not reset room assignments. ${e.message}`)
      })
      .finally(toggleProcessing)
  }

  return {clear, processing}
}
