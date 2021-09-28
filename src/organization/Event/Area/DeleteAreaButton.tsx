import React from 'react'
import styled from 'styled-components'
import Box from '@material-ui/core/Box'
import {useEvent} from 'Event/EventProvider'
import DangerButton from 'lib/ui/Button/DangerButton'
import ConfirmDialog from 'lib/ui/ConfirmDialog'
import {useArea} from 'organization/Event/Area/AreaProvider'
import {
  CONFIGURE_EVENTS,
  usePermissions,
} from 'organization/PermissionsProvider'
import {useHistory} from 'react-router'
import {useEventRoutes} from 'organization/Event/EventRoutes'

export default function DeleteAreaButton(props: {
  onError: (error: string) => void
  clearError: () => void
}) {
  const {processing} = useArea()
  const {event} = useEvent()
  const deleteArea = useDeleteArea()

  const {can} = usePermissions()
  if (!can(CONFIGURE_EVENTS)) {
    return null
  }

  const canDelete = !event.has_started && !processing

  return (
    <ConfirmDialog
      onConfirm={deleteArea}
      description="Deleting an area cannot be undone."
    >
      {(confirm) => (
        <Box mb={2}>
          <DangerButton
            variant="outlined"
            disabled={!canDelete}
            onClick={confirm}
            aria-label="delete area"
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
      * Area delete disabled as event has already started.
    </DisabledDescriptionText>
  )
}

const DisabledDescriptionText = styled.span`
  font-style: italic;
  font-size: 0.75rem;
  margin-top: ${(props) => props.theme.spacing[1]};
`

function useDeleteArea() {
  const {deleteArea} = useArea()
  const history = useHistory()
  const eventRoutes = useEventRoutes()

  const goBackToAreas = () => {
    history.push(eventRoutes.areas.root)
  }

  return () => {
    deleteArea().then(() => {
      goBackToAreas()
    })
  }
}
