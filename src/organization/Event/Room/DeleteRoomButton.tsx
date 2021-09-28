import {useRoom} from 'organization/Event/Room/RoomProvider'
import styled from 'styled-components'
import React from 'react'
import DangerButton from 'lib/ui/Button/DangerButton'
import {useEvent} from 'Event/EventProvider'
import ConfirmDialog from 'lib/ui/ConfirmDialog'
import {useAreaRoutes} from 'organization/Event/Area/AreaRoutes'
import {useHistory} from 'react-router-dom'
import {useRooms} from 'organization/Event/Area/RoomsProvider'
import Box from '@material-ui/core/Box'
import {
  CONFIGURE_EVENTS,
  usePermissions,
} from 'organization/PermissionsProvider'

export default function DeleteRoomButton() {
  const {event} = useEvent()
  const {processing} = useRoom()
  const deleteRoom = useDeleteRoom()

  const {can} = usePermissions()
  if (!can(CONFIGURE_EVENTS)) {
    return null
  }

  const canDelete = !event.has_started && !processing

  return (
    <ConfirmDialog
      onConfirm={deleteRoom}
      description="Deleting a room cannot be undone."
    >
      {(confirm) => (
        <Box mb={2}>
          <DangerButton
            variant="outlined"
            disabled={!canDelete}
            onClick={confirm}
            aria-label="delete room"
            size="small"
          >
            Delete
          </DangerButton>
          <DisabledDescription showing={!canDelete} />
        </Box>
      )}
    </ConfirmDialog>
  )
}

function DisabledDescription(props: {showing: boolean}) {
  if (!props.showing) {
    return null
  }

  return (
    <DisabledDescriptionText>
      * Room delete disabled as event has already started.
    </DisabledDescriptionText>
  )
}

function useDeleteRoom() {
  const {deleteRoom, room} = useRoom()
  const areaRoutes = useAreaRoutes()
  const history = useHistory()
  const {remove} = useRooms()

  const goToBackToArea = () => {
    history.push(areaRoutes.root)
  }

  return () => {
    deleteRoom().then(() => {
      remove(room)
      goToBackToArea()
    })
  }
}

const DisabledDescriptionText = styled.span`
  font-style: italic;
  font-size: 0.75rem;
  margin-top: ${(props) => props.theme.spacing[1]};
`
