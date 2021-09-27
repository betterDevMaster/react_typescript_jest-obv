import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import {withStyles} from '@material-ui/core/styles'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import {useEvent} from 'Event/EventProvider'
import {Room} from 'Event/room'
import {
  onChangeCheckedHandler,
  onChangeNumberHandler,
  onChangeStringHandler,
} from 'lib/dom'
import {useBreadcrumbs} from 'lib/ui/BreadcrumbProvider'
import {spacing} from 'lib/ui/theme'
import {useArea} from 'organization/Event/Area/AreaProvider'
import {useAreaRoutes} from 'organization/Event/Area/AreaRoutes'
import {useEventRoutes} from 'organization/Event/EventRoutes'
import Page from 'organization/Event/Page'
import {useRoom} from 'organization/Event/Room/RoomProvider'
import {useRoomRoutes} from 'organization/Event/Room/RoomRoutes'
import {useOrganization} from 'organization/OrganizationProvider'
import Layout from 'organization/user/Layout'
import React, {useCallback, useState, useEffect} from 'react'
import TechCheckAttendees from 'organization/Event/Room/TechCheckAttendees'
import StartButton from 'organization/Event/Room/StartButton'
import Box from '@material-ui/core/Box'
import HasPermission from 'organization/HasPermission'
import {
  CHECK_IN_ATTENDEES,
  CONFIGURE_EVENTS,
  useCanStartRooms,
  VIEW_RECORDINGS,
} from 'organization/PermissionsProvider'
import OnlineSwitch from 'organization/Event/Room/OnlineSwitch'
import ExportRoomAttendees from 'organization/Event/Room/ExportRoomAttendees'
import RegistrationSwitch from 'organization/Event/Room/RegistrationSwitch'
import RegistrationURL from 'organization/Event/Room/RegistrationURL'
import {RoomMetrics} from 'organization/Event/Area/RoomList'
import {api} from 'lib/url'
import recordingIcon from 'assets/images/recording-icon.png'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useInterval} from 'lib/interval'
import {FETCH_METRICS_INTERVAL_SECS} from 'organization/Event/Area'
import DeleteRoomButton from 'organization/Event/Room/DeleteRoomButton'

export const DEFAULT_MAX_NUM_ATTENDEES = 500

export default function RoomConfig() {
  const {room, update, processing} = useRoom()
  const metrics = useRoomMetrics(room.id)
  const [description, setDescription] = useState(room.description)
  const [maxNumAttendees, setMaxNumAttendees] = useState(room.max_num_attendees)
  const {event} = useEvent()
  const areaRoutes = useAreaRoutes()
  const eventRoutes = useEventRoutes()
  const {routes: orgRoutes} = useOrganization()
  const {area} = useArea()

  const hasUpdatedName = description !== room.description
  const hasUpdatedMaxNumAttendees = maxNumAttendees !== room.max_num_attendees
  const hasUpdates = hasUpdatedName || hasUpdatedMaxNumAttendees
  const roomRoutes = useRoomRoutes()

  const numAttendees = metrics?.num_attendees || '0'

  useBreadcrumbs([
    {
      title: 'Events',
      url: orgRoutes.events.root,
    },
    {
      title: event.name,
      url: eventRoutes.root,
    },
    {title: area.name, url: areaRoutes.root},
    {title: String(room.number), url: roomRoutes.root},
  ])

  const canSave = hasUpdates && !processing

  const save = () => {
    const data: Room = {
      ...room,
      description,
      max_num_attendees: maxNumAttendees,
    }

    update(data)
  }

  const handleToggleMaxNumAttendees = (hasLimit: boolean) => {
    const shouldSetDefault = hasLimit && maxNumAttendees === null
    if (shouldSetDefault) {
      setMaxNumAttendees(DEFAULT_MAX_NUM_ATTENDEES)
      return
    }

    const shouldSetNull = !hasLimit
    if (shouldSetNull) {
      setMaxNumAttendees(null)
    }
  }

  const hasMaxNumAttendees = maxNumAttendees !== null
  const canSetMaxNumAttendees = hasMaxNumAttendees && !processing

  return (
    <Layout>
      <Page>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={2}
        >
          <ExportRoomAttendees room={room} />
          <HasPermission permission={VIEW_RECORDINGS}>
            <RelativeLink to={roomRoutes.recordings} disableStyles>
              <Button variant="outlined">
                <RecordingIconImage src={recordingIcon} alt="Record icon" />
                Recordings
              </Button>
            </RelativeLink>
          </HasPermission>
        </Box>
        <Title variant="h5">{room.number}</Title>
        <DeleteRoomButton />
        <Typography>Attendees: {numAttendees}</Typography>
        <FormControl>
          <FormControlLabel control={<OnlineSwitch />} label="Open" />
        </FormControl>
        <StartRoom processing={processing} />
        <HasPermission permission={CONFIGURE_EVENTS}>
          <FormControl>
            <FormControlLabel
              control={<RegistrationSwitch />}
              label="Registration Enabled"
            />
          </FormControl>
        </HasPermission>
        <RegistrationURL room={room} />
        <HasPermission permission={CONFIGURE_EVENTS}>
          <>
            <TextField
              label="Description"
              fullWidth
              variant="outlined"
              inputProps={{
                'aria-label': 'room description',
              }}
              disabled={processing}
              value={description || ''}
              onChange={onChangeStringHandler(setDescription)}
            />
            <FormControl
              required
              component="fieldset"
              fullWidth
              disabled={processing}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={hasMaxNumAttendees}
                    onChange={onChangeCheckedHandler(
                      handleToggleMaxNumAttendees,
                    )}
                    color="primary"
                    inputProps={{
                      'aria-label': 'toggle has max num attendees',
                    }}
                  />
                }
                label="Limit maximum number of attendees in room?"
              />
            </FormControl>
            <TextField
              label="Maximum number of attendees"
              type="number"
              name="max_num_attendees"
              fullWidth
              variant="outlined"
              value={maxNumAttendees || ''}
              inputProps={{
                'aria-label': 'set max number of attendees',
                min: 0,
                max: 1000,
              }}
              onChange={onChangeNumberHandler(setMaxNumAttendees)}
              disabled={!canSetMaxNumAttendees}
            />
            <Button
              color="primary"
              disabled={!canSave}
              variant="contained"
              onClick={save}
              aria-label="update room"
            >
              Save
            </Button>
          </>
        </HasPermission>

        <HasPermission permission={CHECK_IN_ATTENDEES}>
          <TechCheckAttendees />
        </HasPermission>
      </Page>
    </Layout>
  )
}

function StartRoom(props: {processing: boolean}) {
  const canStartRooms = useCanStartRooms()
  if (!canStartRooms) {
    return null
  }

  return (
    <Box mb={3}>
      <StartButton processing={props.processing} />
    </Box>
  )
}

export function useRoomMetrics(id: number) {
  const {client} = useOrganization()
  const [metrics, setMetrics] = useState<RoomMetrics | null>(null)

  const request = useCallback(() => {
    const url = api(`/rooms/${id}/metrics`)
    client.get<RoomMetrics>(url).then(setMetrics)
  }, [client, id])

  useInterval(request, FETCH_METRICS_INTERVAL_SECS * 1000)

  useEffect(() => {
    request()
  }, [request])

  return metrics
}

const Title = withStyles({
  root: {
    marginBottom: spacing[4],
  },
})(Typography)

const RecordingIconImage = styled.img`
  width: 24px;
  margin-right: ${(props) => props.theme.spacing[1]};
`
