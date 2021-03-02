import {Attendee} from 'Event/attendee'
import React from 'react'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Dialog from 'lib/ui/Dialog'
import {useAttendees} from 'organization/Event/AttendeesProvider'
import {useEvent} from 'Event/EventProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import Form from 'organization/Event/AttendeeManagement/dialog/Form'

export default function UpdateDialog(props: {
  attendee: Attendee | null
  onClose: () => void
}) {
  const {attendee} = props
  const update = useUpdate()
  const isVisible = Boolean(props.attendee)

  if (!attendee) {
    return null
  }

  return (
    <Dialog open={isVisible} onClose={props.onClose}>
      <DialogTitle>Edit Attendee</DialogTitle>
      <DialogContent>
        <Form
          attendee={attendee}
          submit={update.bind(null, attendee)}
          onClose={props.onClose}
          isVisible={isVisible}
        />
      </DialogContent>
    </Dialog>
  )
}

function useUpdate() {
  const list = useAttendees()
  const {event} = useEvent()
  const {client} = useOrganization()

  return (attendee: Attendee, data: Partial<Attendee>) => {
    const url = api(`/events/${event.slug}/attendees/${attendee.id}`)
    return client.patch<Attendee>(url, data).then(list.update)
  }
}
