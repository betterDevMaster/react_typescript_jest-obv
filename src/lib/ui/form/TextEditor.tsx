import React from 'react'
import styled, {createGlobalStyle} from 'styled-components'
import CKEditor from '@ckeditor/ckeditor5-react'
import ClassicEditor from 'obvio-ckeditor'

/**
 * Toolbar items to display
 *
 * resource: https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/configuration.html
 */
const toolbar = [
  'heading',
  '|',
  'mediaEmbed',
  'bold',
  'italic',
  'blockQuote',
  'link',
  'alignment',
  'numberedList',
  'bulletedList',
  'insertTable',
]

export default function TextEditor(props: {
  data: string
  onChange: (value: string) => void
  className?: string
  disabled?: boolean
}) {
  const updateValue = (_: any, editor: any) => {
    props.onChange(editor.getData())
  }

  return (
    <div className={props.className}>
      <CKEditor
        disabled={props.disabled}
        editor={ClassicEditor}
        data={props.data}
        onChange={updateValue}
        config={{
          toolbar,
        }}
      />
      <CkPopupZIndex />
    </div>
  )
}

/**
 * Fix CKEditor scroll when within a dialog. CKEditor has a min-width, and
 * anything below will show blank whitespace with scroll. This container
 * will fix alignment, and hide whitespace.
 */

export const TextEditorContainer = styled.div`
  overflow-x: hidden;
  margin-bottom: ${(props) => props.theme.spacing[5]};
`

/*
Fix CKEditor link pop-up not appearing when inside a Dialog. Note that 
this also required setting disableEnforceFocus on the Dialog
component.
*/
const CkPopupZIndex = createGlobalStyle`
  body {
    --ck-z-modal: 1500
  }
`
