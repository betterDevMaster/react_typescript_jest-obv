import React from 'react'
import {Controller, useForm} from 'react-hook-form'

import Box from '@material-ui/core/Box'
import InputLabel from '@material-ui/core/InputLabel'
import Slider from '@material-ui/core/Slider'
import TextField from '@material-ui/core/TextField'

import {
  NiftyFifty,
  useNiftyFiftyTemplate,
  useNiftyFiftyUpdate,
} from 'Event/template/NiftyFifty'

import {handleChangeSlider} from 'lib/dom'
import ColorPicker from 'lib/ui/ColorPicker'
import {numberFormat} from 'lib/numberFormat'

import ComponentConfig, {
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'

export default function RightPanelConfig(props: {
  isVisible: boolean
  onClose: () => void
}) {
  const {isVisible, onClose} = props

  const template = useNiftyFiftyTemplate()
  const update = useNiftyFiftyUpdate()
  const {rightPanel} = template
  const {control, handleSubmit, register} = useForm()

  const submit = (data: NiftyFifty['rightPanel']) => {
    update({rightPanel: data})

    onClose()
  }

  return (
    <>
      <ComponentConfig
        isVisible={isVisible}
        onClose={onClose}
        title="Right Panel Config"
      >
        <form onSubmit={handleSubmit(submit)}>
          <Box mb={2}>
            <Controller
              name="barTextColor"
              defaultValue={rightPanel.barTextColor}
              control={control}
              render={({value, onChange}) => (
                <ColorPicker
                  label="Navigation Text Color"
                  color={value}
                  onPick={onChange}
                  aria-label="bar text color"
                />
              )}
            />
          </Box>
          <Box mb={2}>
            <Controller
              name="tabUnderlineColor"
              defaultValue={rightPanel.tabUnderlineColor}
              control={control}
              render={({value, onChange}) => (
                <ColorPicker
                  label="Tab Underline Color"
                  color={value}
                  onPick={onChange}
                  aria-label="Tab underline color"
                />
              )}
            />
          </Box>
          <Box mb={2}>
            <Controller
              name="textColor"
              defaultValue={rightPanel.textColor}
              control={control}
              render={({value, onChange}) => (
                <ColorPicker
                  label="Text Color"
                  color={value}
                  onPick={onChange}
                  aria-label="panel text color"
                />
              )}
            />
          </Box>
          <Box mb={2}>
            <Controller
              name="backgroundColor"
              defaultValue={rightPanel.backgroundColor}
              control={control}
              render={({value, onChange}) => (
                <ColorPicker
                  label="Background Color"
                  color={value}
                  onPick={onChange}
                  aria-label="panel background color"
                />
              )}
            />
          </Box>
          <Box mb={2}>
            <InputLabel>Background Opacity</InputLabel>
            <Controller
              name="backgroundOpacity"
              defaultValue={rightPanel.backgroundOpacity}
              control={control}
              render={({value, onChange}) => (
                <Slider
                  min={0}
                  max={1}
                  step={0.1}
                  valueLabelFormat={(num) => numberFormat(num, 10)}
                  onChange={handleChangeSlider(onChange)}
                  valueLabelDisplay="auto"
                  value={value}
                />
              )}
            />
          </Box>
          <Box mb={2}>
            <TextField
              type="number"
              defaultValue={rightPanel.indicatorWidth}
              name="indicatorWidth"
              label="Indicator Width(%)"
              fullWidth
              inputProps={{
                min: 1,
                max: 100,
                ref: register,
              }}
            />
          </Box>
          <SaveButton />
        </form>
      </ComponentConfig>
    </>
  )
}
