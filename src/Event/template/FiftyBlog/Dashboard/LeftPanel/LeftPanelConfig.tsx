import React from 'react'
import {Controller, useForm} from 'react-hook-form'
import Box from '@material-ui/core/Box'
import InputLabel from '@material-ui/core/InputLabel'
import Slider from '@material-ui/core/Slider'
import {handleChangeSlider} from 'lib/dom'
import ColorPicker from 'lib/ui/ColorPicker'
import {
  FiftyBlog,
  useFiftyBlogTemplate,
  useFiftyBlogUpdate,
} from 'Event/template/FiftyBlog'
import ComponentConfig, {
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'

export default function LeftPanelConfig(props: {
  isVisible: boolean
  onClose: () => void
}) {
  const {isVisible, onClose} = props

  const template = useFiftyBlogTemplate()
  const update = useFiftyBlogUpdate()
  const {leftPanel} = template
  const {control, handleSubmit} = useForm()

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
          <Box mb={2}>
            <Controller
              name="barBackgroundColor"
              defaultValue={leftPanel.barBackgroundColor}
              control={control}
              render={({value, onChange}) => (
                <ColorPicker
                  label="Bar Background Color"
                  color={value}
                  onPick={onChange}
                  aria-label="left panel bar background color"
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
                  aria-label="left panel bar text color"
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
                  aria-label="left panel menu text color"
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
                  aria-label="left panel background color"
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
