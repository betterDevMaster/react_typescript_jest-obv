import React, {useState} from 'react'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from 'lib/ui/Dialog'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import TextEditor, {TextEditorContainer} from 'lib/ui/form/TextEditor'
import {useEvent, useUpdate} from 'Event/EventProvider'

import {useToggle} from 'lib/toggle'
import {onChangeStringHandler} from 'lib/dom'

export default function PageSettingsDialog(props: {
  onClose: () => void
  visible: boolean
}) {
  const {visible, onClose} = props
  const {event} = useEvent()

  const {flag: processing, toggle: toggleProcessing} = useToggle()

  const [title, setTitle] = useState(event.zoom_backgrounds_title)
  const [description, setDescription] = useState(
    event.zoom_backgrounds_description,
  )

  const update = useUpdate()

  const submit = () => {
    if (processing) {
      return
    }

    toggleProcessing()

    update({
      zoom_backgrounds_title: title,
      zoom_backgrounds_description: description,
    }).finally(() => {
      toggleProcessing()
      onClose()
    })
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
