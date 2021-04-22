import React, {useEffect, useState} from 'react'
import {useAttendees} from 'organization/Event/AttendeesProvider'

export interface AttendeeImportProps {
  button: (inputId: string, submitting: boolean) => React.ReactElement
  successAlert: (numImported: number, onClose: () => void) => React.ReactElement
}

export default function AttendeeImport(props: AttendeeImportProps) {
  const [file, setFile] = useState<null | File>(null)
  const inputId = 'attendee-import-input'
  const [submitting, setSubmitting] = useState(false)
  const [numImported, setNumImported] = useState<number | null>(null)
  const {importAttendees} = useAttendees()

  const handleFileSelect = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files ? evt.target.files[0] : null
    setFile(file)
  }

  useEffect(() => {
    if (!file || submitting) {
      return
    }

    setSubmitting(true)
    setNumImported(null)

    importAttendees(file)
      .then((res) => {
        setNumImported(res.attendees.length)
      })
      .finally(() => {
        setFile(null)
        setSubmitting(false)
      })
  }, [file, importAttendees, submitting])

  return (
    <>
      {props.button(inputId, submitting)}
      <input
        id={inputId}
        type="file"
        onChange={handleFileSelect}
        hidden
        required
        aria-label="attendee import input"
      />
      <SuccessAlert
        alert={props.successAlert}
        numImported={numImported}
        onClose={() => setNumImported(null)}
      />
    </>
  )
}

function SuccessAlert(props: {
  alert: AttendeeImportProps['successAlert']
  numImported: number | null
  onClose: () => void
}) {
  if (props.numImported === null) {
    return null
  }

  return props.alert(props.numImported, props.onClose)
}
