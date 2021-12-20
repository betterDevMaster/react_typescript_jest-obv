import React from 'react'
import {Controller, useForm} from 'react-hook-form'

import {Box, InputLabel, Slider, Switch} from '@material-ui/core'

import {handleChangeSlider, onChangeCheckedHandler} from 'lib/dom'
import ColorPicker from 'lib/ui/ColorPicker'

import {
  FiftyBlog,
  useFiftyBlogTemplate,
  useFiftyBlogUpdate,
} from 'Event/template/FiftyBlog'

import {useEvent} from 'Event/EventProvider'
import ComponentConfig, {
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'

export default function LeftPanelConfig(props: {
  isVisible: boolean
  isMobile: boolean
  onClose: () => void
}) {
  const {isVisible, isMobile, onClose} = props

  const template = useFiftyBlogTemplate()
  const update = useFiftyBlogUpdate()
  const {leftPanel, dashboardBackgroundProps} = template
  const {control, handleSubmit} = useForm()

  const submit = (data: FiftyBlog) => {
    update(data)
    onClose()
  }

  return (
    <>
      <ComponentConfig
        isVisible={isVisible}
        onClose={onClose}
        title="Left Panel Config"
      >
        <form onSubmit={handleSubmit(submit)}>
          <Box display="flex" flexDirection="column" flex="1" mb={2}>
            <InputLabel>Hide Background</InputLabel>

            <Controller
              name="dashboardBackgroundProps.hidden"
              defaultValue={dashboardBackgroundProps.hidden}
              control={control}
              render={({value, onChange}) => (
                <Switch
                  checked={value}
                  onChange={onChangeCheckedHandler(onChange)}
                  color="primary"
                  inputProps={{
                    'aria-label': 'toggle logo backgournd visible',
                  }}
                />
              )}
            />
          </Box>
          <Box mb={2}>
            <Controller
              name="leftPanel.barTextColor"
              defaultValue={leftPanel.barTextColor}
              control={control}
              render={({value, onChange}) => (
                <ColorPicker
                  label="Bar Text Color"
                  color={value}
                  onPick={onChange}
                  aria-label="left panel bar text color"
                />
              )}
            />
          </Box>
          <Box mb={2}>
            <Controller
              name="leftPanel.menuTextColor"
              defaultValue={leftPanel.menuTextColor}
              control={control}
              render={({value, onChange}) => (
                <ColorPicker
                  label="Menu Text Color"
                  color={value}
                  onPick={onChange}
                  aria-label="left panel menu text color"
                />
              )}
            />
          </Box>
          <Box mb={2}>
            <Controller
              name="leftPanel.arrowColor"
              defaultValue={leftPanel.arrowColor}
              control={control}
              render={({value, onChange}) => (
                <ColorPicker
                  label="Page Arrow Color"
                  color={value}
                  onPick={onChange}
                  aria-label="page arrow color"
                />
              )}
            />
          </Box>
          <Box mb={2}>
            <Controller
              name="leftPanel.backgroundColor"
              defaultValue={leftPanel.backgroundColor}
              control={control}
              render={({value, onChange}) => (
                <ColorPicker
                  label="Panel Background Color"
                  color={value}
                  onPick={onChange}
                  aria-label="left panel background color"
                />
              )}
            />
          </Box>
          <Box mb={2}>
            <InputLabel>Background Opacity</InputLabel>
            <Controller
              name="leftPanel.backgroundOpacity"
              defaultValue={leftPanel.backgroundOpacity}
              control={control}
              render={({value, onChange}) => (
                <Slider
                  min={0}
                  max={1}
                  step={0.1}
                  onChange={handleChangeSlider(onChange)}
                  valueLabelDisplay="auto"
                  value={value}
                />
              )}
            />
          </Box>
          <SaveButton />
        </form>
      </ComponentConfig>
    </>
  )
}
