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
import RoomList, {useRooms} from 'organization/Event/AreaConfig/RoomList'
import {useArea} from 'organization/Event/AreaConfig/AreaProvider'
import {useAreaRoutes} from 'organization/Event/AreaConfig/AreaRoutes'
import Layout from 'organization/user/Layout'
import Page from 'organization/user/Layout/Page'
import React, {useEffect, useState} from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import TabPanel from 'lib/ui/tabs/TabPanel'
import AttendeeList from 'organization/Event/AreaConfig/AttendeeList'
import {useHistory} from 'react-router-dom'

export const ATTENDEES_TAB = 'attendees'

export default function Area(props: {tab?: typeof ATTENDEES_TAB}) {
  const {area, update, processing} = useArea()
  const routes = useAreaRoutes()
  const [tabIndex, setTabIndex] = useState(0)
  const history = useHistory()
  const {rooms, loading} = useRooms()

  useEffect(() => {
    if (props.tab === ATTENDEES_TAB) {
      setTabIndex(1)
      return
    }

    setTabIndex(0)
  }, [props.tab])

  const changeTab = (_: React.ChangeEvent<{}>, newTabIndex: number) => {
    if (newTabIndex === 0) {
      history.push(routes.root)
      return
    }

    history.push(routes.attendees)
  }

  if (loading) {
    return <div>loading...</div>
  }

  if (!rooms) {
    throw new Error('Failed fetching rooms')
  }

  return (
    <Layout>
      <Page>
        <Title variant="h5">Area: {area.name}</Title>
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

        <Tabs onChange={changeTab} value={tabIndex}>
          <Tab label="Rooms" />
          <Tab label="Attendees" />
        </Tabs>
        <TabPanel index={0} currentIndex={tabIndex} render>
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
        </TabPanel>
        <TabPanel index={1} currentIndex={tabIndex} render>
          <AttendeeList rooms={rooms} />
        </TabPanel>
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