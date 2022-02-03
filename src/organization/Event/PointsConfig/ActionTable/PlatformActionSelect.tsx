import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import {ObvioEvent} from 'Event'
import {Action} from 'Event/ActionsProvider'
import {useEvent} from 'Event/EventProvider'
import {onUnknownChangeHandler} from 'lib/dom'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import React from 'react'

export default function PlatformActionSelect(props: {
  action: Action
  setProcessing: (processing: boolean) => void
  processing: boolean
}) {
  const {event} = useEvent()
  const setPlatformAction = useSetPlatformAction()

  const entry = Object.entries(event.platform_actions).find(([_, val]) => {
    return val === props.action.id
  })
  const value = entry ? entry[0] : 0 // use 0 value as unselected as MUI select doesn't accept empty strings

  return (
    <Select
      disabled={props.processing}
      variant="outlined"
      value={value}
      fullWidth
      onChange={onUnknownChangeHandler(
        setPlatformAction(value, props.action.id),
      )}
      inputProps={{
        'aria-label': 'pick platform action',
      }}
    >
      <MenuItem value={0}>Custom Action</MenuItem>
      <MenuItem value="create_password_action_id">Create Password</MenuItem>
      <MenuItem value="complete_check_in_action_id">Complete Check-In</MenuItem>
      <MenuItem value="visit_dashboard_action_id">Visit Dashboard</MenuItem>
      <MenuItem value="download_resource_action_id">Download Resource</MenuItem>
      <MenuItem value="visit_leaderboard_action_id">Visit Leaderboard</MenuItem>
      <MenuItem value="visit_speakers_action_id">Visit Speakers</MenuItem>
      <MenuItem value="visit_sponsors_action_id">Visit Sponsors</MenuItem>
    </Select>
  )
}

function useSetPlatformAction() {
  const {client} = useOrganization()
  const {event, set: setEvent} = useEvent()
  const url = api(`/events/${event.slug}/platform_actions`)

  return (prevKey: string | number, id: number) => (
    newKey: string | number,
  ) => {
    const data = createData(prevKey, id, newKey)
    return client.patch<ObvioEvent>(url, data).then(setEvent)
  }

  function createData(
    prevKey: string | number,
    id: number,
    newKey: string | number,
  ) {
    const shouldUnset = newKey === 0 && prevKey !== 0
    if (shouldUnset) {
      return {
        key: prevKey,
        id: null,
      }
    }

    if (newKey === 0) {
      // Wasn't set anyway
      return
    }

    return {
      key: newKey,
      id,
    }
  }
}
