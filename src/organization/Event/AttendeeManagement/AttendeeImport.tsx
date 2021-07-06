import React, {useEffect, useState} from 'react'
import {useAttendees} from 'organization/Event/AttendeesProvider'

export interface AttendeeImportProps {
  button: (inputId: string, submitting: boolean) => React.ReactElement
  onSuccess: (message: string | null) => void
}

export default function AttendeeImport(props: AttendeeImportProps) {
  const [file, setFile] = useState<null | File>(null)
  const inputId = 'attendee-import-input'
  const [submitting, setSubmitting] = useState(false)
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
    props.onSuccess(null)

    importAttendees(file)
      .then((res) => {
        props.onSuccess(res.message)
      })
      .finally(() => {
        setFile(null)
        setSubmitting(false)
      })
  }, [file, importAttendees, props, submitting])

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
    </>
  )
}
