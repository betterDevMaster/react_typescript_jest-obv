import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import {MenuItemActionProps} from 'organization/Event/AttendeeManagement/AttendeeTools'
import {useEvent} from 'Event/EventProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import {useToggle} from 'lib/toggle'

const SYNC_STARTED_MESSAGE =
  'Mailchimp tags sync started. Depending on how many attendees there are, the sync could take up to 20 minutes.'

export default function SyncMailchimpTagsItem(props: MenuItemActionProps) {
  const {event} = useEvent()

  if (!event.has_mailchimp) {
    return null
  }

  return (
    <MenuItem disabled={props.disabled} onClick={props.onClick}>
      Sync Mailchimp Tags
    </MenuItem>
  )
}

export function useSyncMailchimpTags(onSuccess: (message: string) => void) {
  const {event} = useEvent()
  const {client} = useOrganization()
  const url = api(`/events/${event.slug}/integrations/mailchimp/tags/sync`)
  const {flag: processing, toggle: toggleProcessing} = useToggle()

  const sync = () => {
    if (processing) {
      return
    }

    onSuccess('')
    toggleProcessing()

    client
      .post(url)
      .then(() => onSuccess(SYNC_STARTED_MESSAGE))
      .finally(toggleProcessing)
  }

  return {sync, processing}
}
