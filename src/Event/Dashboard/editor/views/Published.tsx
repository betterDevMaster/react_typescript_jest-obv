import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import React from 'react'

export interface Publishable {
  isVisible: boolean
}

export default function Published(props: {
  component: Publishable
  children: React.ReactElement
}) {
  const isEditMode = useEditMode()
  if (isEditMode || props.component.isVisible) {
    return props.children
  }

  return null
}
