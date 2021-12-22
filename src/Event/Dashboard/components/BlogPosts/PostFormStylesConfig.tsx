import TextField from '@material-ui/core/TextField'
import {onUnknownChangeHandler} from 'lib/dom'
import ColorPicker from 'lib/ui/ColorPicker'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Box from '@material-ui/core/Box'
import Slider from '@material-ui/core/Slider'
import React from 'react'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import ComponentConfig, {
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import {handleChangeSlider} from 'lib/dom'

import {useToggle} from 'lib/toggle'
import {Controller, useForm} from 'react-hook-form'
import {useTemplate} from 'Event/TemplateProvider'
import {useTemplateUpdate} from 'Event/TemplateUpdateProvider'
import {Template} from 'Event/template'

export default function PostFormStylesConfig() {
  const {flag: showingConfig, toggle: toggleConfig} = useToggle()

  const {postFormStyles} = useTemplate()
  const update = useTemplateUpdate()
  const {register, control, handleSubmit} = useForm()

  const submit = (data: Template['postFormStyles']) => {
    update({
      postFormStyles: data,
    })

    toggleConfig()
  }

  return (
    <>
      <StyledEditPostFormStylesButton onClick={toggleConfig} />
      <ComponentConfig
        isVisible={showingConfig}
        onClose={toggleConfig}
        title="Post Form Styles"
      >
        <form onSubmit={handleSubmit(submit)}>
          <TextField
            name="width"
            defaultValue={postFormStyles.width}
            label="Form Width %"
            type="number"
            fullWidth
            inputProps={{
              min: 1,
              max: 100,
              ref: register,
            }}
          />
          <Box mb={2}>
            <InputLabel>Form Position</InputLabel>
            <Controller
              name="position"
              defaultValue={postFormStyles.position}
              control={control}
              render={({value, onChange}) => (
                <Select
                  value={value}
                  onChange={onUnknownChangeHandler(onChange)}
                  fullWidth
                >
                  <MenuItem value="flex-end">Right</MenuItem>
                  <MenuItem value="center">Center</MenuItem>
                  <MenuItem value="flex-start">Left</MenuItem>
                </Select>
              )}
            />
          </Box>
          <Controller
            name="inputStyles.labelColor"
            defaultValue={postFormStyles.inputStyles.labelColor}
            control={control}
            render={({value, onChange}) => (
              <ColorPicker
                label="Label Text Color"
                color={value}
                onPick={onChange}
                aria-label="label text color"
              />
            )}
          />
          <Controller
            name="inputStyles.borderColor"
            defaultValue={postFormStyles.inputStyles.borderColor}
            control={control}
            render={({value, onChange}) => (
              <ColorPicker
                label="Input Border Color"
                color={value}
                onPick={onChange}
                aria-label="input box border color"
              />
            )}
          />
          <Controller
            name="inputStyles.backgroundColor"
            defaultValue={postFormStyles.inputStyles.backgroundColor}
            control={control}
            render={({value, onChange}) => (
              <ColorPicker
                label="Input Background Color"
                color={value}
                onPick={onChange}
                aria-label="input box background color"
              />
            )}
          />
          <Box>
            <InputLabel>Input Background Color Opacity</InputLabel>
            <Controller
              name="inputStyles.backgroundOpacity"
              defaultValue={postFormStyles.inputStyles.backgroundOpacity}
              control={control}
              render={({value, onChange}) => (
                <Slider
                  min={1}
                  max={100}
                  step={1}
                  onChange={handleChangeSlider(onChange)}
                  valueLabelDisplay="auto"
                  defaultValue={value}
                />
              )}
            />
          </Box>
          <Controller
            name="inputStyles.textColor"
            defaultValue={postFormStyles.inputStyles.textColor}
            control={control}
            render={({value, onChange}) => (
              <ColorPicker
                label="Input Text Color"
                color={value}
                onPick={onChange}
                aria-label="input box text color"
              />
            )}
          />
          <Controller
            name="inputStyles.helperTextColor"
            defaultValue={postFormStyles.inputStyles.helperTextColor}
            control={control}
            render={({value, onChange}) => (
              <ColorPicker
                label="Helper Text Color"
                color={value}
                onPick={onChange}
                aria-label="helper text color"
              />
            )}
          />
          <TextField
            name="buttonSize"
            defaultValue={postFormStyles.buttonSize}
            label="Form Button Size %"
            type="number"
            fullWidth
            inputProps={{
              min: 1,
              max: 100,
              ref: register,
            }}
          />
          <TextField
            name="buttonRadius"
            defaultValue={postFormStyles.buttonRadius}
            label="Form Button Radius"
            type="number"
            fullWidth
            inputProps={{
              min: 1,
              max: 50,
              ref: register,
            }}
          />
          <Controller
            name="buttonColor"
            defaultValue={postFormStyles.buttonColor}
            control={control}
            render={({value, onChange}) => (
              <ColorPicker
                label="Submit Button Text Color"
                color={value}
                onPick={onChange}
                aria-label="submit button color"
              />
            )}
          />
          <Controller
            name="buttonBackgroundColor"
            defaultValue={postFormStyles.buttonBackgroundColor}
            control={control}
            render={({value, onChange}) => (
              <ColorPicker
                label="Submit Button Background Color"
                color={value}
                onPick={onChange}
                aria-label="submit button background color"
              />
            )}
          />
          <Controller
            name="buttonHoverBackgroundColor"
            defaultValue={postFormStyles.buttonHoverBackgroundColor}
            control={control}
            render={({value, onChange}) => (
              <ColorPicker
                label="Submit Button Background Hover Color"
                color={value}
                onPick={onChange}
                aria-label="submit button background hover color"
              />
            )}
          />
          <TextField
            name="buttonFontSize"
            defaultValue={postFormStyles.buttonFontSize}
            label="Submit Button Font Size"
            type="number"
            fullWidth
            inputProps={{
              min: 0,
              max: 50,
              ref: register,
            }}
          />
          <Box mb={2}>
            <InputLabel>Submit Button Position</InputLabel>

            <Controller
              name="buttonPosition"
              defaultValue={postFormStyles.buttonPosition}
              control={control}
              render={({value, onChange}) => (
                <Select
                  value={value}
                  onChange={onUnknownChangeHandler(onChange)}
                  fullWidth
                >
                  <MenuItem value="flex-end">Right</MenuItem>
                  <MenuItem value="center">Center</MenuItem>
                  <MenuItem value="flex-start">Left</MenuItem>
                </Select>
              )}
            />
          </Box>
          <SaveButton />
        </form>
      </ComponentConfig>
    </>
  )
}

function EditPostFormStylesButton(props: {
  onClick: () => void
  className?: string
}) {
  return (
    <Button
      className={props.className}
      fullWidth
      size="large"
      variant="contained"
      color="primary"
      aria-label="style post form"
      onClick={props.onClick}
    >
      Edit Post Form Styles
    </Button>
  )
}

const StyledEditPostFormStylesButton = styled(EditPostFormStylesButton)`
  margin-bottom: ${(props) => props.theme.spacing[3]}!important;
`
