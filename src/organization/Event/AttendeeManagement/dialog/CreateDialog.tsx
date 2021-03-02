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

export default function CreateDialog(props: {
  isVisible: boolean
  onClose: () => void
}) {
  const create = useCreate()

  return (
    <Dialog open={props.isVisible} onClose={props.onClose}>
      <DialogTitle>Create Attendee</DialogTitle>
      <DialogContent>
        <Form
          submit={create}
          onClose={props.onClose}
          isVisible={props.isVisible}
        />
      </DialogContent>
    </Dialog>
  )
}

function useCreate() {
  const list = useAttendees()
  const {event} = useEvent()
  const {client} = useOrganization()

  return (data: Partial<Attendee>) => {
    const url = api(`/events/${event.slug}/attendees`)
    return client.post<Attendee>(url, data).then(list.insert)
  }
}
