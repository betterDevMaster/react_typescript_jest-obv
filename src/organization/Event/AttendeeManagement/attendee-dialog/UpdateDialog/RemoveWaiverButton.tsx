import {Attendee} from 'Event/attendee'
import {useEvent} from 'Event/EventProvider'
import {useIfMounted} from 'lib/dom'
import {useToggle} from 'lib/toggle'
import DangerButton from 'lib/ui/Button/DangerButton'
import {api} from 'lib/url'
import {useAttendees} from 'organization/Event/AttendeesProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import React from 'react'

export default function RemoveWaiverButton(props: {attendee: Attendee}) {
  const {attendee} = props
  const {flag: processing, toggle: toggleProcessing} = useToggle()
  const ifMounted = useIfMounted()

  const remove = useRemoveWaiver(attendee)

  const handleRemove = () => {
    if (processing) {
      return
    }

    toggleProcessing()

    remove().catch(ifMounted(toggleProcessing))
  }

  if (!attendee.waiver) {
    return null
  }

  return (
    <DangerButton
      variant="outlined"
      size="small"
      onClick={handleRemove}
      disabled={processing}
    >
      Remove Waiver
    </DangerButton>
  )
}

function useRemoveWaiver(attendee: Attendee) {
  const {client} = useOrganization()
  const {event} = useEvent()
  const url = api(`/events/${event.slug}/attendees/${attendee.id}/waiver`)
  const {update} = useAttendees()

  return () => client.delete<Attendee>(url).then(update)
}
