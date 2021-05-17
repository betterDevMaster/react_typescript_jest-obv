import React from 'react'
import styled from 'styled-components'
import Box from '@material-ui/core/Box'
import Dialog from 'lib/ui/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import TextEditor, {TextEditorContainer} from 'lib/ui/form/TextEditor'
import {
  DEFAULT_FOOTER_BACKGROUND_COLOR,
  DEFAULT_FOOTER_TEXT,
  DEFAULT_FOOTER_TEXT_COLOR,
} from 'Event/template/SimpleBlog/Reports/ReportsConfig'
import ColorPicker from 'lib/ui/ColorPicker'
import {useReportsConfig} from 'organization/Event/ReportsConfig'
import {Report} from 'organization/Event/ReportsProvider'
import {Controller, useForm} from 'react-hook-form'

type FooterSettings = NonNullable<NonNullable<Report['settings']>['footer']>

export default function EditFooterDialog(props: {
  onClose: () => void
  visible: boolean
}) {
  const {visible, onClose} = props
  const {report, processing, update} = useReportsConfig()
  const {handleSubmit, control} = useForm()
  const footer = report.settings?.footer

  const save = (footer: FooterSettings) => {
    if (processing) {
      return
    }

    const settings = {
      ...(report.settings || {}),
      footer,
    }

    update({
      settings,
    }).then(props.onClose)
  }

  return (
    <Dialog open={visible} onClose={onClose} fullWidth disableEnforceFocus>
      <DialogTitle>Edit Footer</DialogTitle>
      <DialogContent>
        <Box pb={2}>
          <form onSubmit={handleSubmit(save)}>
            <Controller
              name="text"
              defaultValue={footer?.text || DEFAULT_FOOTER_TEXT}
              control={control}
              render={({value, onChange}) => (
                <TextEditorContainer>
                  <TextEditor data={value} onChange={onChange} />
                </TextEditorContainer>
              )}
            />

            <Controller
              name="textColor"
              defaultValue={footer?.textColor || DEFAULT_FOOTER_TEXT_COLOR}
              control={control}
              render={({value, onChange}) => (
                <ColorPicker
                  label="Text Color"
                  color={value}
                  onPick={onChange}
                />
              )}
            />

            <Controller
              name="backgroundColor"
              defaultValue={
                footer?.backgroundColor || DEFAULT_FOOTER_BACKGROUND_COLOR
              }
              control={control}
              render={({value, onChange}) => (
                <ColorPicker
                  label="Background Color"
                  color={value}
                  onPick={onChange}
                />
              )}
            />

            <SaveButton
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              aria-label="save header"
              disabled={processing}
            >
              SAVE
            </SaveButton>
          </form>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

const SaveButton = styled(Button)`
  margin-bottom: ${(props) => props.theme.spacing[4]}!important;
`
