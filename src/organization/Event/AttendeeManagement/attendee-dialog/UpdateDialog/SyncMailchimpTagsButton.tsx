import Button from '@material-ui/core/Button'
import {Attendee} from 'Event/attendee'
import {useEvent} from 'Event/EventProvider'
import {useToggle} from 'lib/toggle'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import React from 'react'

export default function SyncMailchimpTagsButton(props: {attendee: Attendee}) {
  const {attendee} = props
  const {flag: processing, toggle: toggleProcessing} = useToggle()

  const sync = useSyncTags(attendee)

  const handleSync = () => {
    if (processing) {
      return
    }

    toggleProcessing()

    sync().finally(toggleProcessing)
  }

  if (!attendee.has_mailchimp) {
    return null
  }

  return (
    <Button
      variant="outlined"
      size="small"
      onClick={handleSync}
      disabled={processing}
    >
      Sync Mailchimp Tags
    </Button>
  )
}

function useSyncTags(attendee: Attendee) {
  const {client} = useOrganization()
  const {event} = useEvent()
  const url = api(
    `/events/${event.slug}/attendees/${attendee.id}/tags/mailchimp`,
  )

  return () => client.post<void>(url)
}
