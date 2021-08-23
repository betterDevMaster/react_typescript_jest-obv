import {Attendee} from 'Event/attendee'
import {useEvent} from 'Event/EventProvider'
import {useIfMounted} from 'lib/dom'
import {useToggle} from 'lib/toggle'
import DangerButton from 'lib/ui/Button/DangerButton'
import {api} from 'lib/url'
import {useAttendees} from 'organization/Event/AttendeesProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import React from 'react'

export default function ClearPasswordButton(props: {attendee: Attendee}) {
  const {attendee} = props
  const {flag: processing, toggle: toggleProcessing} = useToggle()
  const ifMounted = useIfMounted()

  const clear = useClearPassword(attendee)

  const handleClear = () => {
    if (processing) {
      return
    }

    toggleProcessing()

    clear().catch(ifMounted(toggleProcessing))
  }

  if (!attendee.has_password) {
    return null
  }

  return (
    <DangerButton
      variant="outlined"
      size="small"
      onClick={handleClear}
      disabled={processing}
    >
      Clear Password
    </DangerButton>
  )
}

function useClearPassword(attendee: Attendee) {
  const {client} = useOrganization()
  const {event} = useEvent()
  const url = api(`/events/${event.slug}/attendees/${attendee.id}/password`)
  const {update} = useAttendees()

  return () => client.delete<Attendee>(url).then(update)
}
