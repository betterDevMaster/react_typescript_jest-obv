import React, {useState} from 'react'
import Button from '@material-ui/core/Button'
import {spacing} from 'lib/ui/theme'
import withStyles from '@material-ui/core/styles/withStyles'
import {useAttendees} from 'organization/Event/AttendeesProvider'

export interface AttendeeExportProps {
  onSuccess: (message: string | null) => void
}

export default function AttendeeImport(props: AttendeeExportProps) {
  const [submitting, setSubmitting] = useState(false)
  const {exportAttendees, clearError} = useAttendees()

  const attendeesExport = () => {
    props.onSuccess(null)
    clearError()
    setSubmitting(true)
    exportAttendees()
      .then((res) => {
        props.onSuccess(res.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  return (
    <>
      <ExportButton
        variant="outlined"
        color="primary"
        aria-label="export attendees"
        onClick={attendeesExport}
        disabled={submitting}
      >
        Export
      </ExportButton>
    </>
  )
}

const ExportButton = withStyles({
  root: {
    marginRight: spacing[2],
  },
})(Button)
