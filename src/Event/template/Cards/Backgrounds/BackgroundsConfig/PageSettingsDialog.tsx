import React, {useEffect, useState} from 'react'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from 'lib/ui/Dialog'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import TextEditor, {TextEditorContainer} from 'lib/ui/form/TextEditor'
import {useEvent, useUpdate} from 'Event/EventProvider'
import {useCardsTemplate, useCardsUpdate} from 'Event/template/Cards'
import {useToggle} from 'lib/toggle'
import {onChangeStringHandler, onChangeCheckedHandler} from 'lib/dom'
import Switch from 'lib/ui/form/Switch'

export default function PageSettingsDialog(props: {
  onClose: () => void
  visible: boolean
}) {
  const {visible, onClose} = props
  const {event} = useEvent()
  const template = useCardsTemplate()

  const templateSettings = template.zoomBackgrounds

  const {flag: processing, toggle: toggleProcessing} = useToggle()
  const [title, setTitle] = useState(event.zoom_backgrounds_title)
  const [menuTitle, setMenuTitle] = useState(templateSettings.menuTitle)
  const [isVisible, setIsVisible] = useState(templateSettings.isVisible)
  const [description, setDescription] = useState(
    event.zoom_backgrounds_description,
  )

  const update = useUpdate()
  const updateCards = useCardsUpdate()

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [templateSettings])

  const submit = () => {
    if (processing) {
      return
    }

    updateCards({
      zoomBackgrounds: {
        menuTitle,
        isVisible,
      },
    })

    toggleProcessing()

    update({
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
          <Switch
            checked={isVisible}
            onChange={onChangeCheckedHandler(setIsVisible)}
            arial-label="toggle zoom background menu"
            labelPlacement="end"
            color="primary"
            label="Enabled"
          />

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
            name="menuTitle"
            label="Zoom Background Page Menu Title"
            defaultValue={menuTitle}
            onChange={onChangeStringHandler(setMenuTitle)}
            required
            fullWidth
            inputProps={{
              'aria-label': 'edit background page menu title',
            }}
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
