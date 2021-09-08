import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import {usePanels} from 'Event/template/Panels'
import {onChangeStringHandler} from 'lib/dom'
import Dialog from 'lib/ui/Dialog'
import React from 'react'

export default function WelcomeTextConfig(props: {
  isVisible: boolean
  onClose: () => void
}) {
  const {update, template} = usePanels()

  return (
    <Dialog open={props.isVisible} onClose={props.onClose} fullWidth>
      <DialogTitle>Welcome Text</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          placeholder="Text"
          inputProps={{
            'aria-label': 'welcome text',
          }}
          value={template.welcomeText}
          onChange={onChangeStringHandler(update.primitive('welcomeText'))}
        />
        <TextField
          value={template.homeMenuTitle}
          inputProps={{
            'aria-label': 'home menu title',
          }}
          label="Menu Title"
          fullWidth
          onChange={onChangeStringHandler(update.primitive('homeMenuTitle'))}
        />
      </DialogContent>
    </Dialog>
  )
}
