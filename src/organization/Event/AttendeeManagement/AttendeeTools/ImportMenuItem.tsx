import React, {useEffect, useRef, useState} from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import {
  UPDATE_ATTENDEES,
  usePermissions,
} from 'organization/PermissionsProvider'
import {useAttendees} from 'organization/Event/AttendeesProvider'
import {useToggle} from 'lib/toggle'
import {MenuItemActionProps} from 'organization/Event/AttendeeManagement/AttendeeTools'

const ImportMenuItem = React.forwardRef<
  HTMLLIElement,
  Omit<MenuItemActionProps, 'onClick'> & {
    file: File | null
    onSelectFile: (file: File | null) => void
    disabled?: boolean
  }
>((props, ref) => {
  const {can} = usePermissions()
  const inputEl = useRef<HTMLInputElement | null>(null)

  const handleFileSelect = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files ? evt.target.files[0] : null
    props.onSelectFile(file)
  }

  /**
   * Handle permission to import attendees
   */
  if (!can(UPDATE_ATTENDEES)) {
    return null
  }

  const selectFile = () => {
    if (!inputEl.current) {
      return
    }

    inputEl.current.click()
  }

  return (
    <>
      <MenuItem disabled={props.disabled} onClick={selectFile} ref={ref}>
        Import
      </MenuItem>
      <input
        type="file"
        ref={inputEl}
        onChange={handleFileSelect}
        hidden
        required
        aria-label="attendee import input"
      />
    </>
  )
})

export default ImportMenuItem

export function useImportAttendees(onSuccess: (message: string) => void) {
  const {flag: processing, toggle: toggleProcessing} = useToggle()
  const {importAttendees} = useAttendees()

  const [file, setFile] = useState<null | File>(null)

  useEffect(() => {
    if (!file || processing) {
      return
    }

    toggleProcessing()
    onSuccess('')

    importAttendees(file)
      .then((res) => {
        onSuccess(res.message)
      })
      .finally(() => {
        setFile(null)
        toggleProcessing()
      })
  }, [file, importAttendees, onSuccess, toggleProcessing, processing])

  return {processing, file, setFile}
}
