import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import {withStyles} from '@material-ui/core/styles'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'
import {onChangeCheckedHandler, onChangeStringHandler} from 'lib/dom'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {spacing} from 'lib/ui/theme'
import RoomList, {useRooms} from 'organization/Event/Area/RoomList'
import {useArea} from 'organization/Event/Area/AreaProvider'
import {useAreaRoutes} from 'organization/Event/Area/AreaRoutes'
import Layout from 'organization/user/Layout'
import React, {useEffect, useState} from 'react'
import Page from 'organization/Event/Page'
import {useOrganization} from 'organization/OrganizationProvider'
import {useEventRoutes} from 'organization/Event/EventRoutes'
import {useEvent} from 'Event/EventProvider'
import {useBreadcrumbs} from 'lib/ui/BreadcrumbProvider'
import HasPermission from 'organization/HasPermission'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import ExportAreaAttendees from 'organization/Event/Area/ExportAreaAttendees'

export default function Area() {
  const {area, update, processing} = useArea()
  const routes = useAreaRoutes()
  const {rooms, loading} = useRooms()
  const {event} = useEvent()
  const {routes: orgRoutes} = useOrganization()
  const eventRoutes = useEventRoutes()
  const areaRoutes = useAreaRoutes()
  const [offlineTitle, setOfflineTitle] = useState(area.offline_title || '')
  const [offlineDescription, setOfflineDescription] = useState(
    area.offline_description || '',
  )

  useEffect(() => {
    setOfflineTitle(area.offline_title || '')
    setOfflineDescription(area.offline_description || '')
  }, [area])

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
  ])

  if (loading) {
    return (
      <Layout>
        <Page>
          <div>loading...</div>
        </Page>
      </Layout>
    )
  }

  if (!rooms) {
    throw new Error('Failed fetching rooms')
  }

  return (
    <Layout>
      <Page>
        <ExportAreaAttendees area={area} />
        <Title variant="h5">{area.name}</Title>
        <HasPermission permission={CONFIGURE_EVENTS}>
          <>
            <FormControlLabel
              disabled={processing}
              control={
                <Switch
                  checked={area.is_open}
                  onChange={onChangeCheckedHandler(update('is_open'))}
                  color="primary"
                  inputProps={{
                    'aria-label': 'toggle area open status',
                  }}
                />
              }
              label="Open"
            />
            <FormControl
              required
              component="fieldset"
              fullWidth
              disabled={processing}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={area.requires_approval}
                    onChange={onChangeCheckedHandler(
                      update('requires_approval'),
                    )}
                    inputProps={{
                      'aria-label': 'toggle requires approval',
                    }}
                  />
                }
                label="Requires approval?"
              />
            </FormControl>
            <FormControl
              required
              component="fieldset"
              fullWidth
              disabled={processing}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={area.allows_multiple_devices}
                    inputProps={{
                      'aria-label': 'toggle allows multiple devices',
                    }}
                    onChange={onChangeCheckedHandler(
                      update('allows_multiple_devices'),
                    )}
                  />
                }
                label="Can the same user use multiple devices to join at the same time?"
              />
            </FormControl>
            <TextField
              value={offlineTitle}
              fullWidth
              onChange={onChangeStringHandler(setOfflineTitle)}
              variant="outlined"
              label="Offline Title"
              disabled={processing}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      aria-label="save offline title"
                      onClick={() => update('offline_title')(offlineTitle)}
                      color="primary"
                      disabled={processing}
                    >
                      Save
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              value={offlineDescription}
              fullWidth
              onChange={onChangeStringHandler(setOfflineDescription)}
              variant="outlined"
              label="Offline Description"
              disabled={processing}
              multiline
              rows="4"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      aria-label="save offline description"
                      onClick={() =>
                        update('offline_description')(offlineDescription)
                      }
                      color="primary"
                      disabled={processing}
                    >
                      Save
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
            <RelativeLink to={routes.rooms.create} disableStyles>
              <CreateRoomButton
                variant="outlined"
                color="primary"
                aria-label="create room"
              >
                Create Room
              </CreateRoomButton>
            </RelativeLink>
          </>
        </HasPermission>
        <RoomList rooms={rooms} />
      </Page>
    </Layout>
  )
}

const Title = withStyles({
  root: {
    marginBottom: spacing[4],
  },
})(Typography)

const CreateRoomButton = withStyles({
  root: {
    marginBottom: spacing[4],
  },
})(Button)
