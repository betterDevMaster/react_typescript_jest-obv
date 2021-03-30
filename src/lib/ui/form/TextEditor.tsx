import React from 'react'
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
}) {
  const updateValue = (_: any, editor: any) => {
    props.onChange(editor.getData())
  }

  return (
    <CKEditor
      editor={ClassicEditor}
      data={props.data}
      onChange={updateValue}
      config={{
        toolbar,
      }}
    />
  )
}
