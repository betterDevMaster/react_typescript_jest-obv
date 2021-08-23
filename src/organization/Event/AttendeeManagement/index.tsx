import React, {useCallback, useState} from 'react'
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
import {UPDATE_ATTENDEES} from 'organization/PermissionsProvider'
import HasPermission from 'organization/HasPermission'
import AttendeesTable from 'organization/Event/AttendeeManagement/AttendeesTable'
import AssignmentsDialog from 'organization/Event/AttendeeManagement/AssignmentsDialog'
import PointsDialog from 'organization/Event/AttendeeManagement/PointsDialog'
import ExportWaivers from 'organization/Event/AttendeeManagement/ExportWaivers'
import AttendeeExport from 'organization/Event/AttendeeManagement/AttendeeExport'
import {useEffect} from 'react'

export default function AttendeeManagement() {
  const {error: attendeesError, clearError, search, attendees} = useAttendees()
  const [editing, setEditing] = useState<Attendee | null>(null)
  const [viewAssignments, setViewAssignments] = useState<Attendee | null>(null)
  const [createDialogVisible, setCreateDialogVisible] = useState(false)
  const [pointsTarget, setPointsTarget] = useState<Attendee | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  /**
   * Handle updated the current attendee being edited.
   */
  useEffect(() => {
    if (!editing) {
      return
    }

    const updated = attendees.find((a) => a.id === editing.id)
    if (!updated) {
      return
    }

    setEditing(updated)
  }, [attendees, editing])

  const toggleCreateDialog = () => setCreateDialogVisible(!createDialogVisible)

  const edit = (attendee: Attendee) => () => setEditing(attendee)
  const stopEditing = () => setEditing(null)

  const viewAttendeeAssignments = (attendee: Attendee) => () =>
    setViewAssignments(attendee)
  const stopViewingAssignments = () => setViewAssignments(null)

  const showPointsDialog = (attendee: Attendee) => () =>
    setPointsTarget(attendee)
  const hidePointsDialog = () => setPointsTarget(null)

  const onSuccess = useCallback(
    (message: string | null) => setSuccessMessage(message),
    [],
  )
  const onError = useCallback(
    (message: string | null) => setErrorMessage(message),
    [],
  )
  const onCloseSuccess = () => setSuccessMessage(null)

  const error = attendeesError || errorMessage

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
      <PointsDialog attendee={pointsTarget} onClose={hidePointsDialog} />
      <Layout>
        <Page>
          <Box mb={2}>
            <AttendeeExport onSuccess={onSuccess} />
            <HasPermission permission={UPDATE_ATTENDEES}>
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
                  onSuccess={onSuccess}
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
            <ExportWaivers onSuccess={onSuccess} onError={onError} />
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
          <Success onClose={onCloseSuccess}>{successMessage}</Success>
          <Error onClose={clearError}>{error}</Error>
          <AttendeesTable
            onSelectEdit={edit}
            onSelectAssignments={viewAttendeeAssignments}
            onUpdatePoints={showPointsDialog}
          />
        </Page>
      </Layout>
    </>
  )
}

function Success(props: {children: string | null; onClose: () => void}) {
  if (!props.children) {
    return null
  }

  return (
    <StyledAlert severity="info" onClose={props.onClose}>
      {props.children}
    </StyledAlert>
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
