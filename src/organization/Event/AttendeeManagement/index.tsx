import React, {useCallback, useState} from 'react'
import styled from 'styled-components'
import Layout from 'organization/user/Layout'
import {spacing} from 'lib/ui/theme'
import withStyles from '@material-ui/core/styles/withStyles'
import {Attendee} from 'Event/attendee'
import {useAttendees} from 'organization/Event/AttendeesProvider'
import Alert from '@material-ui/lab/Alert'
import Page from 'organization/Event/Page'
import TextField from '@material-ui/core/TextField'
import {onChangeStringHandler} from 'lib/dom'
import UpdateDialog from 'organization/Event/AttendeeManagement/attendee-dialog/UpdateDialog'
import CreateDialog from 'organization/Event/AttendeeManagement/attendee-dialog/CreateDialog'
import AttendeesTable from 'organization/Event/AttendeeManagement/AttendeesTable'
import AssignmentsDialog from 'organization/Event/AttendeeManagement/AssignmentsDialog'
import PointsDialog from 'organization/Event/AttendeeManagement/PointsDialog'
import {useEffect} from 'react'
import AttendeeTools from 'organization/Event/AttendeeManagement/AttendeeTools'
import AddAttendeeButton from 'organization/Event/AttendeeManagement/AddAttendeeButton'

export default function AttendeeManagement() {
  const {error: attendeesError, clearError, search, attendees} = useAttendees()
  const [editing, setEditing] = useState<Attendee | null>(null)
  const [viewAssignments, setViewAssignments] = useState<Attendee | null>(null)
  const [createDialogVisible, setCreateDialogVisible] = useState(false)
  const [pointsTarget, setPointsTarget] = useState<Attendee | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showingEditDialog, setShowingEditDialog] = useState(false)

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

  const edit = (attendee: Attendee) => () => {
    setEditing(attendee)
    setShowingEditDialog(true)
  }
  const stopEditing = () => {
    setEditing(null)
    setShowingEditDialog(false)
  }

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
      <UpdateDialog
        attendee={editing}
        onClose={stopEditing}
        showing={showingEditDialog}
      />
      <AssignmentsDialog
        attendee={viewAssignments}
        onClose={stopViewingAssignments}
      />
      <PointsDialog attendee={pointsTarget} onClose={hidePointsDialog} />
      <Layout>
        <Page>
          <Success onClose={onCloseSuccess}>{successMessage}</Success>
          <Error onClose={clearError}>{error}</Error>
          <Actions>
            <AddAttendeeButton onClick={toggleCreateDialog} />
            <AttendeeTools onSuccess={onSuccess} onError={onError} />
          </Actions>
          <TextField
            variant="outlined"
            label="Search"
            onChange={onChangeStringHandler(search)}
            fullWidth
            inputProps={{
              'aria-label': 'search for attendee',
            }}
          />
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

const StyledAlert = withStyles({
  root: {
    marginBottom: spacing[2],
  },
})(Alert)

const Actions = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[5]};
  display: flex;
  justify-content: space-between;

  /**
   * If there is not AddAttendee button, we still want to right-align
   * the Attendee Tools button.
   */
  button:only-child {
    margin-left: auto;
  }
`
