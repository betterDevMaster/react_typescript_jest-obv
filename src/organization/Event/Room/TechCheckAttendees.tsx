import Button from '@material-ui/core/Button'
import React, {useState, useEffect, useCallback} from 'react'
import {Attendee} from 'Event/attendee'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import {useMarkTechCheckComplete} from 'organization/Event/AttendeesProvider'
import Typography from '@material-ui/core/Typography'
import {spacing} from 'lib/ui/theme'
import withStyles from '@material-ui/core/styles/withStyles'
import {useArea} from 'organization/Event/Area/AreaProvider'
import Box from '@material-ui/core/Box'
import {useOrganization} from 'organization/OrganizationProvider'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import {useRoom} from 'organization/Event/Room/RoomProvider'
import {useInterval} from 'lib/interval'
import {Room} from 'Event/room'
import EditButton from 'lib/ui/Button/CustomButton'
import TechCheckAttendeeUpdateDialog from 'organization/Event/Room/TechCheckAttendeeUpdateDialog'
import {colors} from 'lib/ui/theme'

export default function TechCheckAttendees() {
  const {area} = useArea()

  if (!area.is_tech_check) {
    return null
  }

  return <Content />
}

function Content() {
  const assignments = useTechCheckAssignments()
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const checkIn = useMarkTechCheckComplete()
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const [editing, setEditing] = useState<Attendee | null>(null)
  const edit = (attendee: Attendee) => () => setEditing(attendee)

  const stopEditing = () => {
    setEditing(null)
  }

  useEffect(() => {
    const attendees = assignments.map(({attendee}) => attendee)
    setAttendees(attendees)
  }, [assignments])

  const handleCheckIn = (attendee: Attendee) => () => {
    setError('')

    if (isProcessing) {
      return
    }
    setIsProcessing(true)

    checkIn(attendee)
      .then(() => {
        const updated = attendees.filter((item) => item.id !== attendee.id)
        setAttendees(updated)
      })
      .catch((e) => {
        setError(e.message)
      })
      .finally(() => {
        setIsProcessing(false)
      })
  }

  const update = (target: Attendee) => {
    setAttendees((current) => {
      const updated = current.map((c) => {
        if (c.id === target.id) {
          return target
        }
        return c
      })
      return updated
    })
  }

  return (
    <>
      <TechCheckAttendeeUpdateDialog
        attendee={editing}
        onClose={stopEditing}
        update={update}
      />
      <Box mt={3}>
        <Box mt={2}>
          <Typography variant="h6">Attendees</Typography>
        </Box>
        <Error>{error}</Error>
        <Attendees
          attendees={attendees}
          checkIn={handleCheckIn}
          isProcessing={isProcessing}
          onSelectEdit={edit}
        />
      </Box>
    </>
  )
}

function Attendees(props: {
  attendees: Attendee[]
  checkIn: (attendee: Attendee) => () => void
  onSelectEdit: (attendee: Attendee) => () => void
  isProcessing: boolean
}) {
  const {attendees, checkIn, onSelectEdit, isProcessing} = props
  const hasAttendees = attendees.length > 0

  if (!hasAttendees) {
    return <Typography>No attendees assigned to this room</Typography>
  }

  return (
    <Table size="small" aria-label="tech check assignments table">
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Email</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.attendees.map((attendee) => (
          <TableRow key={attendee.id}>
            <TableCell component="th" scope="row" aria-label="name">
              <EditButton
                variant="text"
                onClick={onSelectEdit(attendee)}
                textColor={colors.primary}
                aria-label="edit"
              >
                {`${attendee.first_name} ${attendee.last_name}`}
              </EditButton>
            </TableCell>
            <TableCell>{attendee.email}</TableCell>
            <TableCell>
              <Button
                variant="contained"
                color="primary"
                aria-label="check in button"
                onClick={checkIn(attendee)}
                disabled={isProcessing}
              >
                Check-In
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

const POLL_TECH_CHECK_ATTENDEES_INTERVAL_MS = 20000

export interface TechCheckAssignment {
  attendee: Attendee
  room: Room
}

export function useTechCheckAssignments() {
  const {client} = useOrganization()
  const {event} = useEvent()
  const {area} = useArea()
  const {room} = useRoom()

  const [assignments, setAssignments] = useState<TechCheckAssignment[]>([])
  const [shouldAutoRefresh, setShouldAutoRefresh] = useState(true)

  useEffect(() => {
    setShouldAutoRefresh(room.is_online)
  }, [room])

  const fetch = useCallback(() => {
    if (!shouldAutoRefresh) {
      return
    }

    const url = api(
      `/events/${event.slug}/areas/${area.id}/room/${room.id}/tech_check_assignments`,
    )
    return client.get<TechCheckAssignment[]>(url).then(setAssignments)
  }, [area, event, client, room, shouldAutoRefresh])

  useEffect(() => {
    fetch()
  }, [fetch])

  useInterval(fetch, POLL_TECH_CHECK_ATTENDEES_INTERVAL_MS)

  return assignments
}

function Error(props: {children: string | null}) {
  if (!props.children) {
    return null
  }

  return <ErrorText color="error">{props.children}</ErrorText>
}

const ErrorText = withStyles({
  root: {
    marginBottom: spacing[3],
  },
})(Typography)
