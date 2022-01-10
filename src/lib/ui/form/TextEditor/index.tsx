import React from 'react'
import styled, {createGlobalStyle} from 'styled-components'
import CKEditor from '@ckeditor/ckeditor5-react'
import DecoupledcEditor from '@ckeditor/ckeditor5-build-decoupled-document'
import {useTextEditor} from 'lib/ui/form/TextEditor/TextEditorProvider'

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

export default function TextEditor(props: {
  data: string
  onChange: (value: string) => void
  className?: string
  disabled?: boolean
  customToolBars?: string[]
  customLinks?: string[]
  placeholder?: string
}) {
  const updateValue = (_: any, editor: any) => {
    props.onChange(editor.getData())
  }

  const {ckUploadUrl, ckToken} = useTextEditor()

  return (
    <div className={props.className}>
      <CKEditor
        editor={DecoupledcEditor}
        disabled={props.disabled}
        // editor={ClassicEditor}
        // In case DB returns 'null' for a text field, we don't
        // want to crash the app so let's just set is as a
        // blank string as a precaution.
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
          links: {
            rexlink: props.customLinks || [],
          },
          placeholder: props.placeholder,
          /**
           * Required for media embed to render in HTML
           */
          mediaEmbed: {
            previewsInData: true,
          },
          cloudServices: {
            /**
             * CKEditor expects the endpoint to fetch the token. Since we
             * require custom client auth, we'll use a function that
             * returns the token.
             *
             * Reference: https://ckeditor.com/docs/ckeditor5/latest/api/module_cloud-services_cloudservices-CloudServicesConfig.html#member-tokenUrl
             *
             * @returns
             */
            tokenUrl: () => Promise.resolve(ckToken),
            uploadUrl: ckUploadUrl,
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
