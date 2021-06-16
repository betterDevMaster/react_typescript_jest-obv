import React, {useState, useEffect, useCallback} from 'react'
import styled from 'styled-components'
import Dialog from 'lib/ui/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import DangerButton from 'lib/ui/Button/DangerButton'
import {onChangeNumberHandler} from 'lib/dom'
import {Attendee} from 'Event/attendee'
import {useEvent} from 'Event/EventProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import {useAsync} from 'lib/async'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import ConfirmDialog from 'lib/ui/ConfirmDialog'
import {useBlocking} from 'lib/blocking'

export interface AttendeeScore {
  points: number
}

export default function UpdatePointsDialog(props: {
  attendee: Attendee | null
  onClose: () => void
}) {
  const {attendee} = props
  const [points, setPoints] = useState(0)
  const [addAmount, setAddAmount] = useState(0)
  const {data: current, loading} = useCurrentPoints(attendee)
  const add = useAddPoints(attendee)
  const clear = useClearPoints(attendee)
  const {blocking, busy} = useBlocking()

  const updatePoints = (res: {points: number}) => {
    setPoints(res.points)
    setAddAmount(0) // reset input
  }

  const handleAdd = blocking((points: number) => add(points).then(updatePoints))
  const handleClear = blocking(() => clear().then(updatePoints))

  useEffect(() => {
    if (!current) {
      return
    }

    setPoints(current.points)
  }, [current])

  const isVisible = Boolean(attendee)

  const safeAddAmount = isNaN(addAmount) ? 0 : addAmount

  return (
    <StyledDialog open={isVisible} onClose={props.onClose} fullWidth>
      <LoadingOverlay isVisible={loading}>
        <CircularProgress />
      </LoadingOverlay>
      <DialogTitle id="form-dialog-title">Update Points</DialogTitle>
      <DialogContent>
        <Box display="flex" justifyContent="flex-end">
          <ConfirmDialog
            description="Clearing points will set the points to 0. This action is NOT reversible."
            onConfirm={handleClear}
          >
            {(confirm) => (
              <DangerButton onClick={confirm} disabled={busy}>
                Clear
              </DangerButton>
            )}
          </ConfirmDialog>
        </Box>
        <Box mb={2}>
          <Typography>Current Points: {points}</Typography>
        </Box>
        <TextField
          label="Amount"
          fullWidth
          type="number"
          disabled={busy}
          value={safeAddAmount}
          onChange={onChangeNumberHandler(setAddAmount)}
          InputProps={{
            inputProps: {min: 0},
          }}
        />
        <ButtonContainer>
          <DangerButton
            onClick={() => handleAdd(-addAmount)}
            color="primary"
            variant="outlined"
            disabled={busy}
          >
            Subtract
          </DangerButton>
          <Button
            onClick={() => handleAdd(addAmount)}
            color="primary"
            variant="contained"
            disabled={busy}
          >
            Add
          </Button>
        </ButtonContainer>
      </DialogContent>
    </StyledDialog>
  )
}

function useCurrentPoints(attendee: Attendee | null) {
  const {event} = useEvent()
  const {client} = useOrganization()

  const getPoints = useCallback(() => {
    if (!attendee) {
      return Promise.resolve({
        points: 0,
      })
    }
    return client.get<{points: number}>(
      api(`/events/${event.slug}/attendees/${attendee.id}/points`),
    )
  }, [client, event, attendee])

  return useAsync(getPoints)
}

function useAddPoints(attendee: Attendee | null) {
  const {event} = useEvent()
  const {client} = useOrganization()

  return (points: number) => {
    if (!attendee) {
      throw new Error(`Could not add points, missing attendee.`)
    }

    return client.patch<{points: number}>(
      api(`/events/${event.slug}/attendees/${attendee.id}/points`),
      {
        points,
      },
    )
  }
}

function useClearPoints(attendee: Attendee | null) {
  const {event} = useEvent()
  const {client} = useOrganization()

  return () => {
    if (!attendee) {
      throw new Error(`Could not clear points, missing attendee.`)
    }

    return client.delete<{points: number}>(
      api(`/events/${event.slug}/attendees/${attendee.id}/points`),
    )
  }
}

const StyledDialog = styled(Dialog)`
  position: relative;
`

const LoadingOverlay = styled.div<{
  isVisible: boolean
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #ffffff;
  display: ${(props) => (props.isVisible ? 'flex' : 'none')};
  z-index: 2;
  align-items: center;
  justify-content: center;
`

const ButtonContainer = styled.div`
  display: flex;
  margin: ${(props) =>
    `0 -${props.theme.spacing[1]} ${props.theme.spacing[4]}`};

  > button {
    flex: 1;
    margin: 0 ${(props) => props.theme.spacing[1]};
  }
`
