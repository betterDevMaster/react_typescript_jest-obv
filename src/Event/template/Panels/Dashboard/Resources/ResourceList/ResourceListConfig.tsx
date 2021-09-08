import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import {usePanels} from 'Event/template/Panels'
import {onChangeStringHandler} from 'lib/dom'
import Dialog from 'lib/ui/Dialog'
import React from 'react'
import ColorPicker from 'lib/ui/ColorPicker'

export default function ResourceListConfig(props: {
  isVisible: boolean
  onClose: () => void
}) {
  const {template, update} = usePanels()
  const {resourceList: list} = template
  const updateResourceList = update.object('resourceList')

  return (
    <Dialog onClose={props.onClose} open={props.isVisible} fullWidth>
      <DialogTitle>Resources</DialogTitle>
      <DialogContent>
        <TextField
          value={list.title}
          inputProps={{
            'aria-label': 'update resources title',
          }}
          label="Title"
          fullWidth
          onChange={onChangeStringHandler(updateResourceList('title'))}
        />
        <TextField
          value={list.menuTitle}
          inputProps={{
            'aria-label': 'update resources menu field',
          }}
          label="Menu Title"
          fullWidth
          onChange={onChangeStringHandler(updateResourceList('menuTitle'))}
        />
        <ColorPicker
          label="Resource Card Background Color"
          color={list.cardBackgroundColor}
          onPick={updateResourceList('cardBackgroundColor')}
          aria-label="resource card background color"
        />
      </DialogContent>
    </Dialog>
  )
}
