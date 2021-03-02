import React, {useState} from 'react'
import styled from 'styled-components'
import Layout from 'organization/user/Layout'
import {colors, spacing} from 'lib/ui/theme'
import withStyles from '@material-ui/core/styles/withStyles'
import {Attendee} from 'Event/attendee'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Button from '@material-ui/core/Button'
import {formatDate} from 'lib/date-time'
import AttendeeImport from 'organization/Event/AttendeeManagement/AttendeeImport'
import {
  useAttendees,
  useCheckIn,
  useCheckOut,
} from 'organization/Event/AttendeesProvider'
import Alert from '@material-ui/lab/Alert'
import {useExportAttendees} from 'organization/Event/AttendeeManagement/attendee-csv'
import Page from 'organization/Event/Page'
import TagList from 'organization/Event/AttendeeManagement/TagList'
import EditButton from 'lib/ui/Button'
import {useRoomAssignments} from 'organization/Event/RoomAssignmentsProvider'
import RoomSelect from 'organization/Event/AttendeeManagement/RoomSelect'
import DangerButton from 'lib/ui/Button/DangerButton'
import TextField from '@material-ui/core/TextField'
import {onChangeStringHandler} from 'lib/dom'
import Box from '@material-ui/core/Box'
import UpdateDialog from 'organization/Event/AttendeeManagement/dialog/UpdateDialog'
import CreateDialog from 'organization/Event/AttendeeManagement/dialog/CreateDialog'

export default function AttendeeManagement() {
  const {
    attendees,
    update: updateAttendee,
    insert: insertAttendees,
    groups,
  } = useAttendees()
  const checkIn = useCheckIn()
  const checkOut = useCheckOut()
  const [error, setError] = useState<string | null>(null)
  const exportAttendees = useExportAttendees({onError: setError})
  const [editing, setEditing] = useState<Attendee | null>(null)
  const {areas, loading} = useRoomAssignments()
  const [searchTerm, setSearchTerm] = useState('')
  const [createAttendeeVisible, setCreateAttendeeVisible] = useState(false)

  const toggleCreateAttendeeVisible = () =>
    setCreateAttendeeVisible(!createAttendeeVisible)

  const filteredAttendees = attendees.filter((attendee) => {
    if (searchTerm === '') {
      return true
    }

    const searchRegex = new RegExp(searchTerm, 'i') // i = case insensitive
    const nameMatch = searchRegex.test(
      `${attendee.first_name} ${attendee.last_name}`,
    )
    const emailMatch = searchRegex.test(attendee.email)

    const hasTag = attendee.tags.includes(searchTerm)

    const groupValues = Object.values(attendee.groups)
    const hasGroup = groupValues.includes(searchTerm)

    return nameMatch || emailMatch || hasTag || hasGroup
  })

  const clearError = () => setError(null)

  const isCheckedIn = (attendee: Attendee) =>
    Boolean(attendee.tech_check_completed_at)

  const toggleCheckIn = (attendee: Attendee) => () => {
    const process = isCheckedIn(attendee) ? checkOut : checkIn

    clearError()

    process(attendee)
      .then(updateAttendee)
      .catch((e) => setError(e.message))
  }

  const handleImportedAttendees = (attendees: Attendee[]) => {
    insertAttendees(attendees)
  }

  const edit = (attendee: Attendee) => () => setEditing(attendee)
  const stopEditing = () => setEditing(null)

  if (loading || !areas) {
    return (
      <Layout>
        <Page>
          <div>loading...</div>
        </Page>
      </Layout>
    )
  }

  return (
    <>
      <UpdateDialog attendee={editing} onClose={stopEditing} />
      <CreateDialog
        isVisible={createAttendeeVisible}
        onClose={toggleCreateAttendeeVisible}
      />
      <Layout>
        <Page>
          <Box mb={2}>
            <ExportButton
              variant="outlined"
              color="primary"
              aria-label="export attendees"
              onClick={exportAttendees}
            >
              Export
            </ExportButton>
            <AttendeeImport
              onSuccess={handleImportedAttendees}
              onError={setError}
              button={(inputId, submitting) => (
                <Button
                  variant="outlined"
                  color="primary"
                  aria-label="import attendees"
                  onClick={clearError}
                  disabled={submitting}
                >
                  <ImportButtonLabel htmlFor={inputId}>
                    Import
                  </ImportButtonLabel>
                </Button>
              )}
              successAlert={(numImported, onClose) => (
                <StyledAlert severity="info" onClose={onClose}>
                  Successfully imported {numImported} attendees
                </StyledAlert>
              )}
            />
            <CreateAttendeeButton
              variant="outlined"
              color="primary"
              aria-label="add attendee"
              onClick={toggleCreateAttendeeVisible}
            >
              Create
            </CreateAttendeeButton>
          </Box>
          <TextField
            variant="outlined"
            label="Search"
            onChange={onChangeStringHandler(setSearchTerm)}
            fullWidth
            inputProps={{
              'aria-label': 'search for attendee',
            }}
          />
          <Error onClose={clearError}>{error}</Error>
          <TableBox>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Tags</TableCell>
                  {groups.map((group, index) => (
                    <TableCell key={index} aria-label="group">
                      {group}
                    </TableCell>
                  ))}
                  <TableCell align="center">Check In</TableCell>
                  {areas.map((area) => (
                    <TableCell key={area.id}>{area.name}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAttendees.map((attendee: Attendee) => (
                  <TableRow key={attendee.id}>
                    <TableCell component="th" scope="row" aria-label="name">
                      <EditButton
                        variant="text"
                        onClick={edit(attendee)}
                        textColor={colors.primary}
                        aria-label="edit"
                      >
                        {`${attendee.first_name} ${attendee.last_name}`}
                      </EditButton>
                    </TableCell>
                    <TableCell aria-label="email">{attendee.email}</TableCell>
                    <TableCell>
                      <TagList attendee={attendee} />
                    </TableCell>
                    {groups.map((key, index) => (
                      <TableCell key={index} aria-label={key}>
                        {attendee.groups[key]}
                      </TableCell>
                    ))}
                    <TableCell align="center">
                      <ToggleCheckInButton
                        isCheckedIn={isCheckedIn(attendee)}
                        onClick={toggleCheckIn(attendee)}
                      />
                      <CheckedInAt>
                        {attendee.tech_check_completed_at}
                      </CheckedInAt>
                    </TableCell>
                    {areas.map((area) => (
                      <TableCell key={area.id}>
                        <RoomSelect attendee={attendee} area={area} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableBox>
        </Page>
      </Layout>
    </>
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

function Error(props: {children: string | null; onClose: () => void}) {
  if (!props.children) {
    return null
  }

  return (
    <StyledAlert severity="error" onClose={props.onClose}>
      {props.children}
    </StyledAlert>
  )
}

const TableBox = styled.div`
  overflow: auto;
`

const ExportButton = withStyles({
  root: {
    marginRight: spacing[2],
  },
})(Button)

const ImportButtonLabel = styled.label`
  cursor: pointer;
`

const StyledAlert = withStyles({
  root: {
    marginBottom: spacing[2],
  },
})(Alert)

const CheckedInText = styled.div`
  margin-top: ${(props) => props.theme.spacing[1]};
`

const CreateAttendeeButton = withStyles({
  root: {
    marginLeft: spacing[2],
  },
})(Button)
