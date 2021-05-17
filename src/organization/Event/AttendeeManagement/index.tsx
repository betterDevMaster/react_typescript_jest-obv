import React, {useState} from 'react'
import styled from 'styled-components'
import Layout from 'organization/user/Layout'
import {spacing} from 'lib/ui/theme'
import withStyles from '@material-ui/core/styles/withStyles'
import {Attendee} from 'Event/attendee'
import Button from '@material-ui/core/Button'
import AttendeeImport from 'organization/Event/AttendeeManagement/AttendeeImport'
import {useAttendees} from 'organization/Event/AttendeesProvider'
import Alert from '@material-ui/lab/Alert'
import Page from 'organization/Event/Page'
import TextField from '@material-ui/core/TextField'
import {onChangeStringHandler} from 'lib/dom'
import Box from '@material-ui/core/Box'
import UpdateDialog from 'organization/Event/AttendeeManagement/attendee-dialog/UpdateDialog'
import CreateDialog from 'organization/Event/AttendeeManagement/attendee-dialog/CreateDialog'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import HasPermission from 'organization/HasPermission'
import AttendeesTable from 'organization/Event/AttendeeManagement/AttendeesTable'
import AssignmentsDialog from 'organization/Event/AttendeeManagement/AssignmentsDialog'

export default function AttendeeManagement() {
  const {error, clearError, exportAttendees, search} = useAttendees()
  const [editing, setEditing] = useState<Attendee | null>(null)
  const [viewAssignments, setViewAssignments] = useState<Attendee | null>(null)
  const [createDialogVisible, setCreateDialogVisible] = useState(false)

  const toggleCreateDialog = () => setCreateDialogVisible(!createDialogVisible)

  const edit = (attendee: Attendee) => () => setEditing(attendee)
  const stopEditing = () => setEditing(null)

  const viewAttendeeAssignments = (attendee: Attendee) => () =>
    setViewAssignments(attendee)
  const stopViewingAssignments = () => setViewAssignments(null)

  return (
    <>
      <CreateDialog
        isVisible={createDialogVisible}
        onClose={toggleCreateDialog}
      />
      <UpdateDialog attendee={editing} onClose={stopEditing} />
      <AssignmentsDialog
        attendee={viewAssignments}
        onClose={stopViewingAssignments}
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
            <HasPermission permission={CONFIGURE_EVENTS}>
              <>
                <AttendeeImport
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
                  onClick={toggleCreateDialog}
                >
                  Create
                </CreateAttendeeButton>
              </>
            </HasPermission>
          </Box>
          <TextField
            variant="outlined"
            label="Search"
            onChange={onChangeStringHandler(search)}
            fullWidth
            inputProps={{
              'aria-label': 'search for attendee',
            }}
          />
          <Error onClose={clearError}>{error}</Error>
          <AttendeesTable
            onSelectEdit={edit}
            onSelectAssignments={viewAttendeeAssignments}
          />
        </Page>
      </Layout>
    </>
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

const CreateAttendeeButton = withStyles({
  root: {
    marginLeft: spacing[2],
  },
})(Button)
