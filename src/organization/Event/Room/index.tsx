import Button from '@material-ui/core/Button'
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
import React, {useState} from 'react'

export const DEFAULT_MAX_NUM_ATTENDEES = 500

export default function RoomConfig() {
  const {room, update, processing, setOnline} = useRoom()
  const [name, setName] = useState(room.name)
  const [maxNumAttendees, setMaxNumAttendees] = useState(room.max_num_attendees)
  const {event} = useEvent()
  const areaRoutes = useAreaRoutes()
  const eventRoutes = useEventRoutes()
  const {routes: orgRoutes} = useOrganization()
  const {area} = useArea()

  const hasUpdatedName = name !== room.name
  const hasUpdatedMaxNumAttendees = maxNumAttendees !== room.max_num_attendees
  const hasUpdates = hasUpdatedName || hasUpdatedMaxNumAttendees
  const roomRoutes = useRoomRoutes()

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
    {title: room.name, url: roomRoutes.root},
  ])

  const canSave = hasUpdates && !processing

  const saveName = () => {
    const data: Room = {
      ...room,
      name,
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
        <Title variant="h5">{room.name}</Title>
        <FormControl>
          <FormControlLabel
            disabled={processing}
            control={
              <Switch
                checked={room.is_online}
                onChange={onChangeCheckedHandler(setOnline)}
                color="primary"
                inputProps={{
                  'aria-label': 'toggle online',
                }}
              />
            }
            label="Open"
          />
        </FormControl>
        <TextField
          label="Room Name"
          required
          fullWidth
          variant="outlined"
          inputProps={{
            'aria-label': 'room name input',
          }}
          disabled={processing}
          value={name}
          onChange={onChangeStringHandler(setName)}
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
                onChange={onChangeCheckedHandler(handleToggleMaxNumAttendees)}
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
          onClick={saveName}
          aria-label="update room"
        >
          Save
        </Button>
      </Page>
    </Layout>
  )
}

const Title = withStyles({
  root: {
    marginBottom: spacing[4],
  },
})(Typography)
