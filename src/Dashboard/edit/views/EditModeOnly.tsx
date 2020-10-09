import {Editable} from 'Dashboard'
import React from 'react'

export default function EditModeOnly(
  props: {children: React.ReactNode} & Editable,
) {
  if (!props.isEditMode) {
    return null
  }

  return <>{props.children}</>
}
