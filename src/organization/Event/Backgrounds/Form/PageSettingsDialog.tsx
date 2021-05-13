import React from 'react'
import {Controller, useForm} from 'react-hook-form'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from 'lib/ui/Dialog'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import ColorPicker from 'lib/ui/ColorPicker'
import TextEditor, {TextEditorContainer} from 'lib/ui/form/TextEditor'
import {useEvent} from 'Event/EventProvider'
import {useTemplate} from 'Event/TemplateProvider'
import {createSimpleBlog} from 'Event/template/SimpleBlog'
import {useBackgrounds} from 'organization/Event/Backgrounds/BackgroundsProvider'

type SettingsFormData = {
  title: string
  description: string
  backToDashboardText: string
  backToDashboardTextColor: string
}

export default function PageSettingsDialog(props: {
  onClose: () => void
  visible: boolean
}) {
  const {visible, onClose} = props

  const template = useTemplate()
  const {zoomBackgrounds: templateSettings} = template
  const {zoomBackgrounds: templateDefaults} = createSimpleBlog()
  const zoomBackgrounds =
    typeof templateSettings !== 'undefined'
      ? templateSettings
      : templateDefaults

  const {isSubmitting, setBackgroundData} = useBackgrounds()

  const {handleSubmit, register, control} = useForm()

  const {event} = useEvent()

  const submit = (data: SettingsFormData) => {
    setBackgroundData(
      {
        zoom_backgrounds_title: data.title,
        zoom_backgrounds_description: data.description,
      },
      {
        ...zoomBackgrounds,
        backToDashboardText: data.backToDashboardText,
        backToDashboardTextColor: data.backToDashboardTextColor,
      },
    )
  }

  return (
    <Dialog open={visible} onClose={onClose} fullWidth disableEnforceFocus>
      <DialogTitle>Zoom Background</DialogTitle>
      <DialogContent>
        <Box pb={2}>
          <form onSubmit={handleSubmit(submit)}>
            <TextField
              label="Title"
              name="title"
              defaultValue={event.zoom_backgrounds_title}
              variant="outlined"
              fullWidth
              inputProps={{'aria-label': 'page title', ref: register}}
              disabled={isSubmitting}
            />
            <Controller
              name="description"
              defaultValue={event.zoom_backgrounds_description}
              control={control}
              render={({onChange, value}) => (
                <TextEditorContainer>
                  <TextEditor data={value} onChange={onChange} />
                </TextEditorContainer>
              )}
            />
            <TextField
              label="Back to Dashboard Text"
              name="backToDashboardText"
              defaultValue={zoomBackgrounds.backToDashboardText}
              variant="outlined"
              fullWidth
              inputProps={{'aria-label': 'page title', ref: register}}
              disabled={isSubmitting}
            />
            <Controller
              name="backToDashboardTextColor"
              control={control}
              defaultValue={zoomBackgrounds.backToDashboardTextColor}
              render={({value, onChange}) => (
                <ColorPicker
                  label="Back to Dashboard Text Color"
                  color={value}
                  onPick={onChange}
                  aria-label="set back to dashboard text color"
                  disabled={isSubmitting}
                />
              )}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting}
              aria-label="save"
            >
              Save
            </Button>
          </form>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
