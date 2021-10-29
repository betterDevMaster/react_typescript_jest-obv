import React from 'react'
import styled from 'styled-components'
import {colors} from 'lib/ui/theme'
import {Attendee} from 'Event/attendee'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Button from '@material-ui/core/Button'
import {formatDate} from 'lib/date-time'
import {useAttendees} from 'organization/Event/AttendeesProvider'
import EditButton from 'lib/ui/Button'
import DangerButton from 'lib/ui/Button/DangerButton'
import {CHECK_IN_ATTENDEES} from 'organization/PermissionsProvider'
import HasPermission from 'organization/HasPermission'
import IconButton from '@material-ui/core/IconButton'
import AssignmentOutlined from '@material-ui/icons/AssignmentOutlined'
import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents'
import {useEvent} from 'Event/EventProvider'

export default function AttendeesTable(props: {
  onSelectEdit: (attendee: Attendee) => () => void
  onSelectAssignments: (attendee: Attendee) => () => void
  onUpdatePoints: (attendee: Attendee) => () => void
}) {
  const {
    attendees,
    groups,
    toggleTechCheckComplete: toggleCheckIn,
    loading: loadingAttendees,
  } = useAttendees()

  const {event} = useEvent()

  const hasAttendees = attendees.length > 0

  const loading = loadingAttendees

  if (loading) {
    return (
      <Box justifyContent="center" display="flex" paddingY={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (!hasAttendees) {
    return (
      <Box paddingY={4}>
        <Typography align="center">No Attendees Found</Typography>
      </Box>
    )
  }

  return (
    <>
      <Typography align="right" variant="subtitle1">
        Showing {attendees.length} of {event.num_registered_attendees} attendees
      </Typography>
      <TableBox>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              {groups.map((group, index) => (
                <TableCell key={index} aria-label="group">
                  {group}
                </TableCell>
              ))}
              <HasTechCheck>
                <HasPermission permission={CHECK_IN_ATTENDEES}>
                  <TableCell align="center">Tech Check</TableCell>
                </HasPermission>
              </HasTechCheck>
              <TableCell>{/* Room Assignments Cell */}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendees.map((attendee: Attendee) => (
              <TableRow key={attendee.id}>
                <TableCell component="th" scope="row" aria-label="name">
                  <EditButton
                    variant="text"
                    onClick={props.onSelectEdit(attendee)}
                    textColor={colors.primary}
                    aria-label="edit"
                  >
                    {`${attendee.first_name} ${attendee.last_name}`}
                  </EditButton>
                </TableCell>
                <TableCell aria-label="email">{attendee.email}</TableCell>
                {groups.map((key, index) => (
                  <TableCell key={index} aria-label={key}>
                    {attendee.groups[key]}
                  </TableCell>
                ))}
                <HasTechCheck>
                  <HasPermission permission={CHECK_IN_ATTENDEES}>
                    <TableCell align="center">
                      <ToggleCheckInButton
                        isCheckedIn={attendee.has_completed_tech_check}
                        onClick={toggleCheckIn(attendee)}
                      />
                      <CheckedInAt>
                        {attendee.tech_check_completed_at}
                      </CheckedInAt>
                    </TableCell>
                  </HasPermission>
                </HasTechCheck>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={props.onSelectAssignments(attendee)}
                    aria-label="view room assignments"
                  >
                    <AssignmentOutlined />
                  </IconButton>
                  <IconButton
                    color="primary"
                    aria-label="update points"
                    onClick={props.onUpdatePoints(attendee)}
                  >
                    <EmojiEventsIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableBox>
    </>
  )
}

function HasTechCheck(props: {children: React.ReactElement}) {
  const {hasTechCheck} = useEvent()
  if (!hasTechCheck) {
    return null
  }

  return props.children
}

function ToggleCheckInButton(props: {
  isCheckedIn: boolean
  onClick: () => void
}) {
  const label = 'toggle check in'

  if (props.isCheckedIn) {
    return (
      <DangerButton
        variant="outlined"
        aria-label={label}
        fullWidth
        onClick={props.onClick}
      >
        Check-Out
      </DangerButton>
    )
  }
  return (
    <Button
      variant="contained"
      color="primary"
      aria-label={label}
      fullWidth
      onClick={props.onClick}
    >
      Check-In
    </Button>
  )
}

function CheckedInAt(props: {children: Attendee['tech_check_completed_at']}) {
  const label = 'date of completing tech check'

  if (!props.children) {
    return null
  }

  return (
    <CheckedInText aria-label={label}>
      {formatDate(props.children)}
    </CheckedInText>
  )
}

const CheckedInText = styled.div`
  margin-top: ${(props) => props.theme.spacing[1]};
`

const TableBox = styled.div`
  overflow: auto;
`
