import {Attendee} from 'Event/attendee'
import React, {useCallback} from 'react'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Dialog from 'lib/ui/Dialog'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import {useEvent} from 'Event/EventProvider'
import {RoomAssignment} from 'organization/Event/AttendeeManagement/AssignmentsDialog/RoomSelect'
import {useAsync} from 'lib/async'
import CircularProgress from '@material-ui/core/CircularProgress'
import AssignmentsTable from 'organization/Event/AttendeeManagement/AssignmentsDialog/AssignmentsTable'
import Box from '@material-ui/core/Box'

export default function UpdateDialog(props: {
  attendee: Attendee | null
  onClose: () => void
}) {
  const {attendee} = props
  const isVisible = Boolean(props.attendee)

  const {data: assignments, loading} = useAssignments(props.attendee)

  if (!attendee) {
    return null
  }

  return (
    <Dialog open={isVisible} onClose={props.onClose} fullWidth>
      <DialogTitle>
        {attendee.first_name} {attendee.last_name}
      </DialogTitle>
      <DialogContent>
        <Body attendee={attendee} loading={loading} assignments={assignments} />
      </DialogContent>
    </Dialog>
  )
}

function Body(props: {
  attendee: Attendee
  loading: boolean
  assignments: RoomAssignment[] | null
}) {
  const {attendee, loading, assignments} = props

  if (loading || !assignments) {
    return (
      <Box justifyContent="center" display="flex" paddingY={4}>
        <CircularProgress />
      </Box>
    )
  }

  return <AssignmentsTable attendee={attendee} assignments={assignments} />
}

function useAssignments(attendee: Attendee | null) {
  const {client} = useOrganization()
  const {
    event: {slug},
  } = useEvent()

  const request = useCallback(() => {
    if (!attendee) {
      return Promise.resolve(null)
    }

    const url = api(`/events/${slug}/attendees/${attendee.id}/room_assignments`)

    return client.get<RoomAssignment[]>(url)
  }, [client, slug, attendee])

  return useAsync(request)
}
