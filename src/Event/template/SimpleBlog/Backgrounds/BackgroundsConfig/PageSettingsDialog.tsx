import React, {useEffect, useState} from 'react'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from 'lib/ui/Dialog'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import ColorPicker from 'lib/ui/ColorPicker'
import TextEditor, {TextEditorContainer} from 'lib/ui/form/TextEditor'
import {useEvent, useUpdate} from 'Event/EventProvider'
import {useToggle} from 'lib/toggle'
import {onChangeStringHandler} from 'lib/dom'
import {
  useSimpleBlogTemplate,
  useSimpleBlogUpdate,
} from 'Event/template/SimpleBlog'

export default function PageSettingsDialog(props: {
  onClose: () => void
  visible: boolean
}) {
  const {visible, onClose} = props
  const {event} = useEvent()
  const template = useSimpleBlogTemplate()

  const templateSettings = template.zoomBackgrounds

  const {flag: processing, toggle: toggleProcessing} = useToggle()
  const [backToDashboardText, setBackToDashboardText] = useState(
    templateSettings.backToDashboardText,
  )
  const [backToDashboardTextColor, setBackToDashboardTextColor] = useState(
    templateSettings.backToDashboardTextColor,
  )
  const [title, setTitle] = useState(event.zoom_backgrounds_title)
  const [description, setDescription] = useState(
    event.zoom_backgrounds_description,
  )

  const updateTemplate = useSimpleBlogUpdate()

  const updateEvent = useUpdate()

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setBackToDashboardText(templateSettings.backToDashboardText)
    setBackToDashboardTextColor(templateSettings.backToDashboardTextColor)

    setLoading(false)
  }, [templateSettings])

  const submit = () => {
    if (processing) {
      return
    }

    toggleProcessing()

    updateTemplate({
      zoomBackgrounds: {
        backToDashboardText,
        backToDashboardTextColor,
      },
    })

    updateEvent({
      zoom_backgrounds_title: title,
      zoom_backgrounds_description: description,
    })
      .then(() => {
        toggleProcessing()
        props.onClose()
      })
      .catch(toggleProcessing)
  }

  if (loading) {
    return null
  }

  return (
    <Dialog open={visible} onClose={onClose} fullWidth disableEnforceFocus>
      <DialogTitle>Zoom Background</DialogTitle>
      <DialogContent>
        <Box pb={2}>
          <TextField
            label="Title"
            name="title"
            value={title || ''}
            onChange={onChangeStringHandler(setTitle)}
            variant="outlined"
            fullWidth
            inputProps={{'aria-label': 'page title'}}
            disabled={processing}
          />
          <TextEditorContainer>
            <TextEditor data={description || ''} onChange={setDescription} />
          </TextEditorContainer>
          <TextField
            label="Back to Dashboard Text"
            name="backToDashboardText"
            value={backToDashboardText}
            variant="outlined"
            fullWidth
            onChange={onChangeStringHandler(setBackToDashboardText)}
            inputProps={{'aria-label': 'page description'}}
            disabled={processing}
          />
          <ColorPicker
            label="Back to Dashboard Text Color"
            color={backToDashboardTextColor}
            onPick={setBackToDashboardTextColor}
            aria-label="set back to dashboard text color"
            disabled={processing}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            disabled={processing}
            aria-label="save"
            onClick={submit}
          >
            Save
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
