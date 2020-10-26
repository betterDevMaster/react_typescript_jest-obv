import {useEditMode} from 'Dashboard/edit/state/edit-mode'
import {usePreviewMode} from 'Dashboard/edit/views/PreviewBar'
import React from 'react'

export default function EditModeOnly(props: {children: React.ReactNode}) {
  const isEditMode = useEditMode()
  const isPreviewMode = usePreviewMode()
  if (!isEditMode || isPreviewMode) {
    return null
  }

  return <>{props.children}</>
}
