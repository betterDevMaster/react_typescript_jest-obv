import DialogContent from '@material-ui/core/DialogContent'
import InputLabel from '@material-ui/core/InputLabel'
import Box from '@material-ui/core/Box'
import DialogTitle from '@material-ui/core/DialogTitle'
import {usePanels} from 'Event/template/Panels'
import ColorPicker from 'lib/ui/ColorPicker'
import Dialog from 'lib/ui/Dialog'
import React from 'react'
import Slider from '@material-ui/core/Slider'
import {handleChangeSlider, onChangeCheckedHandler} from 'lib/dom'
import Switch from 'lib/ui/form/Switch'

export default function RightPanelConfig(props: {
  isVisible: boolean
  onClose: () => void
}) {
  const {
    template: {rightPanel},
    update,
  } = usePanels()

  const {isVisible, onClose} = props

  const updateRightPanel = update.object('rightPanel')

  return (
    <Dialog open={isVisible} onClose={onClose} fullWidth>
      <DialogTitle>Left Panel Bar</DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <Switch
            checked={rightPanel.isDarkMode}
            onChange={onChangeCheckedHandler(updateRightPanel('isDarkMode'))}
            arial-label="set dark mode"
            labelPlacement="end"
            color="primary"
            label="Dark Mode"
          />
        </Box>
        <Box mb={2}>
          <ColorPicker
            label="Bar Background Color"
            color={rightPanel.barBackgroundColor}
            onPick={updateRightPanel('barBackgroundColor')}
          />
        </Box>
        <Box mb={2}>
          <ColorPicker
            label="Bar Text Color"
            color={rightPanel.barTextColor}
            onPick={updateRightPanel('barTextColor')}
          />
        </Box>
        <Box mb={2}>
          <ColorPicker
            label="Tab Underline Color"
            color={rightPanel.tabUnderlineColor}
            onPick={updateRightPanel('tabUnderlineColor')}
          />
        </Box>
        <Box mb={2}>
          <ColorPicker
            label="Text Color"
            color={rightPanel.textColor}
            onPick={updateRightPanel('textColor')}
          />
        </Box>
        <Box mb={2}>
          <ColorPicker
            label="Panel Background Color"
            color={rightPanel.backgroundColor}
            onPick={updateRightPanel('backgroundColor')}
          />
        </Box>
        <Box mb={2}>
          <InputLabel>Background Opacity</InputLabel>
          <Slider
            min={0}
            max={1}
            step={0.1}
            onChange={handleChangeSlider(updateRightPanel('backgroundOpacity'))}
            valueLabelDisplay="auto"
            value={rightPanel.backgroundOpacity}
          />
        </Box>
      </DialogContent>
    </Dialog>
  )
}
