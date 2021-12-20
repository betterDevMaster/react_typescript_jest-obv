import React from 'react'
import {Controller, useForm} from 'react-hook-form'
import Box from '@material-ui/core/Box'
import InputLabel from '@material-ui/core/InputLabel'
import Slider from '@material-ui/core/Slider'
import {handleChangeSlider} from 'lib/dom'
import ColorPicker from 'lib/ui/ColorPicker'
import Switch from 'lib/ui/form/Switch'
import {
  FiftyBlog,
  useFiftyBlogTemplate,
  useFiftyBlogUpdate,
} from 'Event/template/FiftyBlog'
import ComponentConfig, {
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'

export default function RightPanelConfig(props: {
  isMobile: boolean
  isVisible: boolean
  onClose: () => void
}) {
  const {isVisible, isMobile, onClose} = props

  const template = useFiftyBlogTemplate()
  const update = useFiftyBlogUpdate()
  const {rightPanel} = template
  const {control, handleSubmit} = useForm()

  const submit = (data: FiftyBlog['rightPanel']) => {
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
              name="isDarkMode"
              defaultValue={rightPanel.isDarkMode}
              control={control}
              render={({value, onChange}) => (
                <Switch
                  checked={value}
                  onChange={onChange}
                  arial-label="set dark mode"
                  labelPlacement="end"
                  color="primary"
                  label="Dark Mode"
                />
              )}
            />
          </Box>
          {!isMobile && (
            <>
              <Box mb={2}>
                <Controller
                  name="barBackgroundColor"
                  defaultValue={rightPanel.barBackgroundColor}
                  control={control}
                  render={({value, onChange}) => (
                    <ColorPicker
                      label="Bar Background Color"
                      color={value}
                      onPick={onChange}
                      aria-label="bar background color"
                    />
                  )}
                />
              </Box>
              <Box mb={2}>
                <Controller
                  name="barTextColor"
                  defaultValue={rightPanel.barTextColor}
                  control={control}
                  render={({value, onChange}) => (
                    <ColorPicker
                      label="Bar Text Color"
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
            </>
          )}
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
                  label="Panel Background Color"
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
