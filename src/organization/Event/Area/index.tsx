import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import {withStyles} from '@material-ui/core/styles'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'
import {onChangeCheckedHandler} from 'lib/dom'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {spacing} from 'lib/ui/theme'
import RoomList, {useRooms} from 'organization/Event/Area/RoomList'
import {useArea} from 'organization/Event/Area/AreaProvider'
import {useAreaRoutes} from 'organization/Event/Area/AreaRoutes'
import Layout from 'organization/user/Layout'
import React from 'react'
import Page from 'organization/Event/Page'
import {useOrganization} from 'organization/OrganizationProvider'
import {useEventRoutes} from 'organization/Event/EventRoutes'
import {useEvent} from 'Event/EventProvider'
import {useBreadcrumbs} from 'lib/ui/BreadcrumbProvider'

export default function Area() {
  const {area, update, processing} = useArea()
  const routes = useAreaRoutes()
  const {rooms, loading} = useRooms()
  const {event} = useEvent()
  const {routes: orgRoutes} = useOrganization()
  const eventRoutes = useEventRoutes()
  const areaRoutes = useAreaRoutes()

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
        <Title variant="h5">{area.name}</Title>
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
                onChange={onChangeCheckedHandler(update('requires_approval'))}
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
        <RelativeLink to={routes.rooms.create} disableStyles>
          <CreateRoomButton
            variant="outlined"
            color="primary"
            aria-label="create room"
          >
            Create Room
          </CreateRoomButton>
        </RelativeLink>
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
