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

export default function AttendeesTable(props: {
  onSelectEdit: (attendee: Attendee) => () => void
  onSelectAssignments: (attendee: Attendee) => () => void
}) {
  const {
    attendees,
    groups,
    isCheckedIn,
    toggleCheckIn,
    loading,
  } = useAttendees()

  const hasAttendees = attendees.length > 0

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
            <HasPermission permission={CHECK_IN_ATTENDEES}>
              <TableCell align="center">Check In</TableCell>
            </HasPermission>
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
              <HasPermission permission={CHECK_IN_ATTENDEES}>
                <TableCell align="center">
                  <ToggleCheckInButton
                    isCheckedIn={isCheckedIn(attendee)}
                    onClick={toggleCheckIn(attendee)}
                  />
                  <CheckedInAt>{attendee.tech_check_completed_at}</CheckedInAt>
                </TableCell>
              </HasPermission>
              <TableCell>
                <IconButton
                  color="primary"
                  onClick={props.onSelectAssignments(attendee)}
                  aria-label="view room assignments"
                >
                  <AssignmentOutlined />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableBox>
  )
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
