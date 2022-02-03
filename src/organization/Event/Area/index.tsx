import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import {withStyles} from '@material-ui/core/styles'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
import {onChangeCheckedHandler} from 'lib/dom'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {spacing} from 'lib/ui/theme'
import RoomList, {RoomMetrics} from 'organization/Event/Area/RoomList'
import {useArea} from 'organization/Event/Area/AreaProvider'
import {useAreaRoutes} from 'organization/Event/Area/AreaRoutes'
import Layout from 'organization/user/Layout'
import React, {useEffect, useState, useCallback} from 'react'
import Page from 'organization/Event/Page'
import {useOrganization} from 'organization/OrganizationProvider'
import {useEventRoutes} from 'organization/Event/EventRoutes'
import {useEvent} from 'Event/EventProvider'
import {useBreadcrumbs} from 'lib/ui/BreadcrumbProvider'
import HasPermission from 'organization/HasPermission'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import ExportAreaAttendees from 'organization/Event/Area/ExportAreaAttendees'
import ClearRoomAssignmentsButton from 'organization/Event/Area/ClearRoomAssignmentsButton'
import ErrorAlert from 'lib/ui/alerts/ErrorAlert'
import {useToggle} from 'lib/toggle'
import ConfirmDialog from 'lib/ui/ConfirmDialog'
import {useRooms} from 'organization/Event/Area/RoomsProvider'
import {api} from 'lib/url'
import {Area as AreaModel} from 'organization/Event/AreasProvider'
import {useInterval} from 'lib/interval'
import NameField from 'organization/Event/Area/NameField'
import DeleteAreaButton from 'organization/Event/Area/DeleteAreaButton'
import OfflineTextConfig from 'organization/Event/Area/OfflineTextConfig'

const CONFIRM_TURN_OFF_TECH_CHECK_REASSIGN =
  "This area is currently assigned to Tech Check.  If you turn this setting off, and an attendee hasn't completed their tech check, they may see an offline message when they try to check in and their original room is unavailable.  Are you sure you wish to disable?"

export const FETCH_METRICS_INTERVAL_SECS = 30

export default function Area() {
  const {area, update, processing} = useArea()
  const routes = useAreaRoutes()
  const {rooms} = useRooms()
  const {event} = useEvent()
  const {routes: orgRoutes} = useOrganization()
  const eventRoutes = useEventRoutes()
  const areaRoutes = useAreaRoutes()
  const [error, setError] = useState<string | null>(null)
  const clearError = () => setError(null)
  const {
    flag: showingConfirmReassignDialog,
    toggle: toggleConfirmReassignDialog,
  } = useToggle()
  const metrics = useAreaMetrics()
  const totalAttendees = sumAttendees(metrics)

  const updateKey = <T extends keyof AreaModel>(key: T) => (
    val: AreaModel[T],
  ) =>
    update({
      [key]: val,
    })

  /**
   * If an area is assigned to Tech Check, we want to confirm with the
   * user that they'd really want to turn OFF re-assign.
   * @param reassign
   * @returns
   */
  const handleSetReassign = (reassign: boolean) => {
    // Not TC, free to turn on/off
    if (!area.is_tech_check) {
      update({
        reassign_on_offline: reassign,
      })
      return
    }

    // Don't need to confirm on turning on
    if (reassign) {
      update({
        reassign_on_offline: reassign,
      })
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

    update({reassign_on_offline: false})
    toggleConfirmReassignDialog()
  }

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
          <ErrorAlert>{error}</ErrorAlert>
          <Box>
            <Left>
              <ExportAreaAttendees area={area} />
              <RelativeLink to={areaRoutes.rules} disableStyles>
                <RulesButton variant="outlined" aria-label="Area Rules">
                  Rules
                </RulesButton>
              </RelativeLink>
            </Left>
            <div>
              <ClearRoomAssignmentsButton
                onError={setError}
                clearError={clearError}
              />
            </div>
          </Box>
          <NameField />
          <DeleteAreaButton />
          <HasPermission permission={CONFIGURE_EVENTS}>
            <>
              <Box>
                <FormControlLabel
                  disabled={processing}
                  control={
                    <Switch
                      checked={area.is_open}
                      onChange={onChangeCheckedHandler(updateKey('is_open'))}
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
                        updateKey('requires_approval'),
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
                        updateKey('allows_multiple_devices'),
                      )}
                    />
                  }
                  label="Can the same user use multiple devices to join at the same time?"
                />
              </FormControl>
              <OfflineTextSection />
              <RelativeLink to={routes.rooms.create} disableStyles>
                <CreateRoomButton
                  variant="outlined"
                  color="primary"
                  aria-label="create rooms"
                >
                  Create Rooms
                </CreateRoomButton>
              </RelativeLink>
            </>
          </HasPermission>
          <Typography>Total Attendees: {totalAttendees}</Typography>
          <RoomList rooms={rooms} metrics={metrics} />
        </Page>
      </Layout>
    </>
  )
}

function useAreaMetrics() {
  const {area} = useArea()

  return useFetchAreaMetrics(area)
}

export function useNumAttendees(area: AreaModel) {
  const metrics = useFetchAreaMetrics(area)
  return sumAttendees(metrics)
}

function useFetchAreaMetrics(area: AreaModel) {
  const {client} = useOrganization()
  const {
    event: {slug},
  } = useEvent()
  const [metrics, setMetrics] = useState<RoomMetrics[]>([])

  const {id} = area

  const fetch = useCallback(() => {
    const url = api(`/events/${slug}/areas/${id}/metrics`)
    client.get<RoomMetrics[]>(url).then(setMetrics)
  }, [client, slug, id])

  useInterval(fetch, FETCH_METRICS_INTERVAL_SECS * 1000)

  useEffect(() => {
    fetch()
  }, [fetch])

  return metrics
}

function sumAttendees(metrics: RoomMetrics[]) {
  return metrics.reduce((acc, i) => {
    const num = parseInt(i.num_attendees)

    if (isNaN(num)) {
      return acc
    }

    return acc + num
  }, 0)
}

function OfflineTextSection() {
  const {flag: configVisible, toggle: toggleConfig} = useToggle()

  return (
    <>
      <OfflineTextConfig isVisible={configVisible} onClose={toggleConfig} />
      <OfflineTextButton
        onClick={toggleConfig}
        variant="outlined"
        color="primary"
        aria-label="offline text button"
      >
        Offline Text
      </OfflineTextButton>
    </>
  )
}

const OfflineTextButton = withStyles({
  root: {
    marginBottom: spacing[4],
    display: 'block',
  },
})(Button)

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

const Left = styled.div`
  display: flex;
`

const RulesButton = styled(Button)`
  margin-left: ${(props) => props.theme.spacing[2]};
`
