import {onChangeStringHandler} from 'lib/dom'
import React from 'react'

export default function TextEditor(props: {
  data: string
  onChange: (value: string) => void
  className?: string
  disabled?: boolean
  customToolBars?: string[]
  customLinks?: string[]
}) {
  return (
    <input
      value={props.data}
      type="text"
      onChange={onChangeStringHandler(props.onChange)}
      data-testid="text editor"
      disabled={props.disabled}
    />
  )
}

// Re-export actual implementations of everything else
const {TextEditorContainer} = jest.requireActual('lib/ui/form/TextEditor')
export {TextEditorContainer}
