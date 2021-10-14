import TextField from '@material-ui/core/TextField'
import {Cards, useCards} from 'Event/template/Cards'
import {onUnknownChangeHandler} from 'lib/dom'
import ColorPicker from 'lib/ui/ColorPicker'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Box from '@material-ui/core/Box'
import React from 'react'
import ComponentConfig, {
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import {Controller, useForm} from 'react-hook-form'

export default function PostFormStylesConfig(props: {
  isVisible: boolean
  onClose: () => void
}) {
  const {isVisible, onClose} = props

  const {handleSubmit, control, register} = useForm()

  const {
    update,
    template: {postFormStyles},
  } = useCards()

  const save = (data: Cards['postFormStyles']) => {
    const updated: Cards['postFormStyles'] = {
      ...postFormStyles,
      ...data,
      inputStyles: {
        ...postFormStyles.inputStyles,
        ...data?.inputStyles,
      },
    }

    update.primitive('postFormStyles')(updated)
    onClose()
  }

  return (
    <ComponentConfig
      isVisible={isVisible}
      onClose={onClose}
      title="Post Form Styles"
    >
      <form onSubmit={handleSubmit(save)}>
        <TextField
          name="width"
          value={postFormStyles.width}
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
        <TextField
          defaultValue={postFormStyles.inputStyles.backgroundOpacity}
          name="inputStyles.backgroundOpacity"
          label="Input Background Color Opacity"
          type="number"
          fullWidth
          inputProps={{
            min: 0,
            max: 100,
            ref: register,
          }}
        />
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
            min: 0,
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
  )
}
