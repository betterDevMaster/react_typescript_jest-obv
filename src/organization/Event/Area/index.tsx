import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import {withStyles} from '@material-ui/core/styles'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
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
import ClearRoomAssignmentsButton from 'organization/Event/Area/ClearRoomAssignmentsButton'
import ErrorAlert from 'lib/ui/alerts/ErrorAlert'
import {useToggle} from 'lib/toggle'
import ConfirmDialog from 'lib/ui/ConfirmDialog'

const CONFIRM_TURN_OFF_TECH_CHECK_REASSIGN =
  "This area is currently assigned to Tech Check.  If you turn this setting off, and an attendee hasn't completed their tech check, they may see an offline message when they try to check in and their original room is unavailable.  Are you sure you wish to disable?"

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
  const [error, setError] = useState<string | null>(null)
  const clearError = () => setError(null)
  const {
    flag: showingConfirmReassignDialog,
    toggle: toggleConfirmReassignDialog,
  } = useToggle()

  /**
   * If an area is assigned to Tech Check, we want to confirm with the
   * user that they'd really want to turn OFF re-assign.
   * @param reassign
   * @returns
   */
  const handleSetReassign = (reassign: boolean) => {
    // Not TC, free to turn on/off
    if (!area.is_tech_check) {
      update('reassign_on_offline')(reassign)
      return
    }

    // Don't need to confirm on turning on
    if (reassign) {
      update('reassign_on_offline')(reassign)
      return
    }

    toggleConfirmReassignDialog()
  }

  const turnOffTechCheckReassign = () => {
    /**
     * Only allow turning off TC re-assign via confirm dialog
     */
    if (!showingConfirmReassignDialog) {
      return
    }

    update('reassign_on_offline')(false)
    toggleConfirmReassignDialog()
  }

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
    <>
      <ConfirmDialog
        description={CONFIRM_TURN_OFF_TECH_CHECK_REASSIGN}
        onConfirm={turnOffTechCheckReassign}
        showing={showingConfirmReassignDialog}
        onCancel={toggleConfirmReassignDialog}
      />
      <Layout>
        <Page>
          <StyledErrorAlert>{error}</StyledErrorAlert>
          <Box>
            <ExportAreaAttendees area={area} />
            <ClearRoomAssignmentsButton
              area={area}
              onError={setError}
              clearError={clearError}
            />
          </Box>
          <Title variant="h5">{area.name}</Title>
          <HasPermission permission={CONFIGURE_EVENTS}>
            <>
              <Box>
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
                <FormControlLabel
                  disabled={processing}
                  control={
                    <Switch
                      checked={area.reassign_on_offline}
                      onChange={onChangeCheckedHandler(handleSetReassign)}
                      color="primary"
                      inputProps={{
                        'aria-label': 'toggle re-assign on offline',
                      }}
                    />
                  }
                  label="Re-assign on offline"
                />
              </Box>
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
    </>
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

const Box = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`

const StyledErrorAlert = styled(ErrorAlert)`
  margin-bottom: ${(props) => props.theme.spacing[5]};
`
