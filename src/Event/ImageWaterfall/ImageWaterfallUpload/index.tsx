import React, {useState} from 'react'
import NavButton from 'Event/Dashboard/components/NavButton'
import UploadButton from 'Event/ImageWaterfall/ImageWaterfallUpload/UploadButton'
import UploadDialog from 'Event/ImageWaterfall/ImageWaterfallUpload/UploadDialog'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'

export default function ImageWaterfallUpload(props: NavButton) {
  const [visibleUploadForm, setVisibleUploadForm] = useState(false)
  const isEditMode = useEditMode()

  const toggleVisibleUploadForm = () => setVisibleUploadForm(!visibleUploadForm)

  /**
   * Don't show uploader in edit mode or the user might think it works
   */
  if (isEditMode) {
    return <UploadButton {...props} onClick={toggleVisibleUploadForm} />
  }

  return (
    <>
      <UploadDialog
        onClose={toggleVisibleUploadForm}
        visible={visibleUploadForm}
      />
      <UploadButton {...props} onClick={toggleVisibleUploadForm} />
    </>
  )
}
