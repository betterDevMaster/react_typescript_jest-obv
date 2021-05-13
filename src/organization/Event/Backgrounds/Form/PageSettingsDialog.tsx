import React, {useState} from 'react'
import styled from 'styled-components'
import {Controller, useForm} from 'react-hook-form'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from 'lib/ui/Dialog'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import TextEditor, {TextEditorContainer} from 'lib/ui/form/TextEditor'
import {useEvent} from 'Event/EventProvider'

type SettingsFormData = {
  sponsor_page_title: string
  description: string
  backToDashboardText: string
  backToDashboardTextColor: string
  sponsorSpace: number
  sponsorSeperator: boolean
}

export default function PageSettingsDialog(props: {
  onClose: () => void
  visible: boolean
}) {
  const {visible, onClose} = props
  const {handleSubmit, register, control} = useForm()
  const [processing, setProcessing] = useState(false)

  const {event} = useEvent()

  const submit = (form: SettingsFormData) => {
    if (processing) {
      return
    }
  }

  return (
    <Dialog open={visible} onClose={onClose} fullWidth disableEnforceFocus>
      <DialogTitle>Zoom Background</DialogTitle>
      <DialogContent>
        <Box pb={2}>
          <form onSubmit={handleSubmit(submit)}>
            <TextField
              label="Title"
              name="zoom_backgrounds_title"
              defaultValue={event.zoom_backgrounds_title}
              variant="outlined"
              fullWidth
              inputProps={{'aria-label': 'page title', ref: register}}
              disabled={processing}
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
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={processing}
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