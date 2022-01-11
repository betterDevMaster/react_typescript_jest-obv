import React from 'react'
import styled, {createGlobalStyle} from 'styled-components'
import CKEditor from '@ckeditor/ckeditor5-react'
import DecoupledcEditor from '@ckeditor/ckeditor5-build-decoupled-document'

/**
 * Toolbar items to display
 *
 * resource: https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/configuration.html
 */
const toolbar = [
  'heading',
  '|',
  'mediaEmbed',
  '|',
  'fontFamily',
  'fontSize',
  'fontColor',
  'fontBackgroundColor',
  '|',
  'bold',
  'italic',
  'blockQuote',
  'link',
  'alignment',
  'numberedList',
  'bulletedList',
  'insertTable',
  '|',
  'imageUpload',
]

export default function TextArea(props: {
  data: string
  onChange: (value: string) => void
  className?: string
  disabled?: boolean
  customToolBars?: string[]
  customLinks?: string[]
  ckUploadUrl: string | ''
  tokenUrl: string | ''
}) {
  const updateValue = (_: any, editor: any) => {
    props.onChange(editor.getData())
  }

  return (
    <div className={props.className}>
      <CKEditor
        disabled={props.disabled}
        editor={DecoupledcEditor}
        data={props.data || ''}
        onInit={(editor: any) => {
          const eElement = editor.ui.getEditableElement().parentElement
          eElement.insertBefore(
            editor.ui.view.toolbar.element,
            eElement.firstChild,
          )
        }}
        onChange={updateValue}
        config={{
          toolbar: props.customToolBars || toolbar,
          fontSize: {
            options: [9, 11, 13, 'default', 17, 19, 21],
          },
          links: {
            rexlink: props.customLinks || [],
          },
          mediaEmbed: {
            previewsInData: true,
          },
          cloudServices: {
            tokenUrl: props.tokenUrl,
            uploadUrl: props.ckUploadUrl,
          },
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

  /** 
     * Add a required min-height to prevent the pop-ups from being
     * cut off when inside a dialog.
     */
  .ck-editor__editable_inline {
    min-height: 200px;
  }
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
