import React, {useState} from 'react'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import UploadDialog from 'Event/Dashboard/components/NavButton/ImageEntryUpload/UploadDialog'
import {NavButtonProps, Button} from 'Event/Dashboard/components/NavButton'

export default function ImageEntryUpload(props: NavButtonProps) {
  const [visibleUploadForm, setVisibleUploadForm] = useState(false)
  const isEditMode = useEditMode()

  const toggleVisibleUploadForm = () => setVisibleUploadForm(!visibleUploadForm)

  /**
   * Don't show uploader in edit mode or the user might think it works
   */
  if (isEditMode) {
    return <Button {...props} onClick={toggleVisibleUploadForm} />
  }

  return (
    <>
      <UploadDialog
        onClose={toggleVisibleUploadForm}
        visible={visibleUploadForm}
      />

      <Button {...props} onClick={toggleVisibleUploadForm} />
    </>
  )
}
