import DialogContent from '@material-ui/core/DialogContent'
import Box from '@material-ui/core/Box'
import DialogTitle from '@material-ui/core/DialogTitle'
import {usePanels} from 'Event/template/Panels'
import ColorPicker from 'lib/ui/ColorPicker'
import Dialog from 'lib/ui/Dialog'
import React from 'react'
import Slider from '@material-ui/core/Slider'
import {handleChangeSlider} from 'lib/dom'
import InputLabel from '@material-ui/core/InputLabel'

export default function LeftPanelConfig(props: {
  isVisible: boolean
  onClose: () => void
}) {
  const {
    template: {leftPanel},
    update,
  } = usePanels()

  const {isVisible, onClose} = props

  const updateLeftPanel = update.object('leftPanel')

  return (
    <Dialog open={isVisible} onClose={onClose} fullWidth>
      <DialogTitle>Left Panel Bar</DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <ColorPicker
            label="Bar Background Color"
            color={leftPanel.barBackgroundColor}
            onPick={updateLeftPanel('barBackgroundColor')}
          />
        </Box>

        <Box mb={2}>
          <ColorPicker
            label="Bar Text Color"
            color={leftPanel.barTextColor}
            onPick={updateLeftPanel('barTextColor')}
          />
        </Box>

        <Box mb={2}>
          <ColorPicker
            label="Panel Background Color"
            color={leftPanel.backgroundColor}
            onPick={updateLeftPanel('backgroundColor')}
          />
        </Box>
        <Box mb={2}>
          <InputLabel>Background Opacity</InputLabel>
          <Slider
            min={0}
            max={1}
            step={0.1}
            onChange={handleChangeSlider(updateLeftPanel('backgroundOpacity'))}
            valueLabelDisplay="auto"
            value={leftPanel.backgroundOpacity}
          />
        </Box>
      </DialogContent>
    </Dialog>
  )
}
