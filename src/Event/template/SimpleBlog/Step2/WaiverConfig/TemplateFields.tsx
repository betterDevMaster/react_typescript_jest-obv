import React from 'react'
import InputLabel from '@material-ui/core/InputLabel'
import Typography from '@material-ui/core/Typography'
import ColorPicker from 'lib/ui/ColorPicker'
import Grid from '@material-ui/core/Grid'
import Slider from '@material-ui/core/Slider'
import {handleChangeSlider} from 'lib/dom'
import TextField from '@material-ui/core/TextField'
import Box from '@material-ui/core/Box'
import {useSimpleBlogTemplate} from 'Event/template/SimpleBlog'
import BackgroundPicker from 'lib/ui/form/BackgroundPicker'
import {Controller, UseFormMethods} from 'react-hook-form'

const MIN_BUTTON_BORDER_RADIUS = 0
const MAX_BUTTON_BORDER_RADIUS = 100

const MIN_BUTTON_BORDER_WIDTH = 0
const MAX_BUTTON_BORDER_WIDTH = 20

export default function TemplateFields(
  props: {submitting: boolean} & Pick<UseFormMethods, 'control' | 'register'>,
) {
  const {control, register, submitting} = props
  const {waiver} = useSimpleBlogTemplate()

  return (
    <>
      <Box mb={1}>
        <Typography variant="h6">Button Styles</Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            name="template.buttonText"
            defaultValue={waiver.buttonText}
            label="Label"
            fullWidth
            inputProps={{
              'aria-label': 'waiver button text',
              ref: register,
            }}
            disabled={submitting}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="template.buttonBackground"
            defaultValue={waiver.buttonBackground}
            control={control}
            render={({value, onChange}) => (
              <BackgroundPicker
                label="Background"
                background={value}
                onChange={onChange}
                disabled={submitting}
              />
            )}
          />
          <Controller
            name="template.buttonHoverBackground"
            defaultValue={waiver.buttonHoverBackground}
            control={control}
            render={({value, onChange}) => (
              <BackgroundPicker
                label="Hover"
                background={value}
                onChange={onChange}
                disabled={submitting}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="template.buttonTextColor"
            defaultValue={waiver.buttonTextColor}
            control={control}
            render={({value, onChange}) => (
              <ColorPicker
                label="Text Color"
                color={value}
                onPick={onChange}
                aria-label="button text color"
                disabled={submitting}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="template.buttonBorderColor"
            defaultValue={waiver.buttonBorderColor}
            control={control}
            render={({value, onChange}) => (
              <ColorPicker
                label="Border Color"
                color={value}
                onPick={onChange}
                aria-label="submit button text color"
                disabled={submitting}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputLabel>Border Radius</InputLabel>
          <Controller
            name="template.buttonBorderRadius"
            defaultValue={waiver.buttonBorderRadius}
            control={control}
            render={({value, onChange}) => (
              <Slider
                valueLabelDisplay="auto"
                aria-label="submit button border radius"
                value={value}
                onChange={handleChangeSlider(onChange)}
                step={1}
                min={MIN_BUTTON_BORDER_RADIUS}
                max={MAX_BUTTON_BORDER_RADIUS}
                disabled={submitting}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputLabel>Border Width</InputLabel>
          <Controller
            name="template.buttonBorderWidth"
            defaultValue={waiver.buttonBorderWidth}
            control={control}
            render={({value, onChange}) => (
              <Slider
                valueLabelDisplay="auto"
                aria-label="submit button border width"
                value={value}
                onChange={handleChangeSlider(onChange)}
                step={1}
                min={MIN_BUTTON_BORDER_WIDTH}
                max={MAX_BUTTON_BORDER_WIDTH}
                disabled={submitting}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <InputLabel>Size</InputLabel>
          <Controller
            name="template.buttonWidth"
            defaultValue={waiver.buttonWidth}
            control={control}
            render={({value, onChange}) => (
              <Slider
                valueLabelDisplay="auto"
                aria-label="submit button width"
                value={value}
                onChange={handleChangeSlider(onChange)}
                step={1}
                min={1}
                max={12}
                disabled={submitting}
              />
            )}
          />
        </Grid>
      </Grid>
    </>
  )
}
