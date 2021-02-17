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
import {useAttendees, useCheckIn} from 'organization/Event/AttendeesProvider'
import Alert from '@material-ui/lab/Alert'
import {useExportAttendees} from 'organization/Event/AttendeeManagement/attendee-csv'
import Page from 'organization/Event/Page'
import TagList from 'organization/Event/AttendeeManagement/TagList'
import EditDialog from 'organization/Event/AttendeeManagement/EditDialog'
import EditButton from 'lib/ui/Button'

export default function AttendeeManagement() {
  const {
    attendees,
    update: updateAttendee,
    insert: insertAttendees,
    groups,
  } = useAttendees()
  const checkIn = useCheckIn()
  const [error, setError] = useState<string | null>(null)
  const exportAttendees = useExportAttendees({onError: setError})
  const [editing, setEditing] = useState<Attendee | null>(null)

  const clearError = () => setError(null)

  const completeCheckIn = (attendee: Attendee) => () => {
    clearError()

    checkIn(attendee)
      .then(updateAttendee)
      .catch((e) => setError(e.message))
  }

  const handleImportedAttendees = (attendees: Attendee[]) => {
    insertAttendees(attendees)
  }

  const edit = (attendee: Attendee) => () => setEditing(attendee)
  const stopEditing = () => setEditing(null)

  return (
    <>
      <EditDialog attendee={editing} onClose={stopEditing} />
      <Layout>
        <Page>
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
                <ImportButtonLabel htmlFor={inputId}>Import</ImportButtonLabel>
              </Button>
            )}
            successAlert={(numImported, onClose) => (
              <StyledAlert severity="info" onClose={onClose}>
                Successfully imported {numImported} attendees
              </StyledAlert>
            )}
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
                </TableRow>
              </TableHead>
              <TableBody>
                {attendees.map((attendee: Attendee) => (
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
                      <Button
                        variant="contained"
                        color="primary"
                        aria-label="mark as completed tech check"
                        onClick={completeCheckIn(attendee)}
                        disabled={Boolean(attendee.tech_check_completed_at)}
                      >
                        Check-In
                      </Button>
                      <CheckedInAt>
                        {attendee.tech_check_completed_at}
                      </CheckedInAt>
                    </TableCell>
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
