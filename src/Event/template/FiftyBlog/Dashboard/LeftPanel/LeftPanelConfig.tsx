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
import EventImageUpload from 'organization/Event/DashboardConfig/EventImageUpload'

export default function LeftPanelConfig(props: {
  isVisible: boolean
  onClose: () => void
}) {
  const {isVisible, onClose} = props

  const template = useFiftyBlogTemplate()
  const update = useFiftyBlogUpdate()
  const {leftPanel} = template
  const {control, handleSubmit} = useForm()
  const {event} = useEvent()

  const submit = (data: FiftyBlog['leftPanel']) => {
    update({leftPanel: data})

    onClose()
  }

  return (
    <>
      <ComponentConfig
        isVisible={isVisible}
        onClose={onClose}
        title="Left Panel Bar"
      >
        <form onSubmit={handleSubmit(submit)}>
          <Box display="flex" flexDirection="column" flex="1" mb={2}>
            <InputLabel>Hide Background</InputLabel>

            <Controller
              name="backgroundHidden"
              defaultValue={leftPanel.backgroundHidden}
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
              name="barTextColor"
              defaultValue={leftPanel.barTextColor}
              control={control}
              render={({value, onChange}) => (
                <ColorPicker
                  label="Bar Text Color"
                  color={value}
                  onPick={onChange}
                  aria-label="fiftyblog left panel bar text color"
                />
              )}
            />
          </Box>
          <Box mb={2}>
            <Controller
              name="menuTextColor"
              defaultValue={leftPanel.menuTextColor}
              control={control}
              render={({value, onChange}) => (
                <ColorPicker
                  label="Menu Text Color"
                  color={value}
                  onPick={onChange}
                  aria-label="fiftyblog left panel menu text color"
                />
              )}
            />
          </Box>
          <Box mb={2}>
            <Controller
              name="arrowColor"
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
              name="backgroundColor"
              defaultValue={leftPanel.backgroundColor}
              control={control}
              render={({value, onChange}) => (
                <ColorPicker
                  label="Panel Background Color"
                  color={value}
                  onPick={onChange}
                  aria-label="fiftyblog left panel background color"
                />
              )}
            />
          </Box>
          <Box mb={2}>
            <InputLabel>Background Opacity</InputLabel>
            <Controller
              name="backgroundOpacity"
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
