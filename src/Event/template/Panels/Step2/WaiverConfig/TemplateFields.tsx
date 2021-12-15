import React from 'react'
import InputLabel from '@material-ui/core/InputLabel'
import Typography from '@material-ui/core/Typography'
import ColorPicker from 'lib/ui/ColorPicker'
import Grid from '@material-ui/core/Grid'
import Slider from '@material-ui/core/Slider'
import {handleChangeSlider, onChangeStringHandler} from 'lib/dom'
import TextField from '@material-ui/core/TextField'
import Box from '@material-ui/core/Box'
import {colors} from 'lib/ui/theme'
import {Panels} from 'Event/template/Panels'
import BackgroundPicker from 'lib/ui/form/BackgroundPicker'

const MIN_BUTTON_BORDER_RADIUS = 0
const MAX_BUTTON_BORDER_RADIUS = 100

const MIN_BUTTON_BORDER_WIDTH = 0
const MAX_BUTTON_BORDER_WIDTH = 20

export const DEFAULT_WAIVER_CONFIG_PROPS: NonNullable<Panels['waiver']> = {
  buttonText: '',
  buttonBackground: colors.primary,
  buttonTextColor: '#FFFFFF',
  buttonBorderColor: colors.primary,
  buttonBorderRadius: 4,
  buttonBorderWidth: 0,
  buttonWidth: 12,
}

export type PanelsWaiverTemplateProps = NonNullable<Panels['waiver']>

export type WaiverTemplatePropSetter = <
  K extends keyof PanelsWaiverTemplateProps
>(
  key: K,
) => (value: PanelsWaiverTemplateProps[K]) => void

export interface TemplateFieldProps {
  waiver: PanelsWaiverTemplateProps
  set: WaiverTemplatePropSetter
  submitting: boolean
}

export default function TemplateFields(props: TemplateFieldProps) {
  const {waiver, set, submitting} = props

  return (
    <>
      <Box mb={1}>
        <Typography variant="h6">Button Styles</Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            value={waiver.buttonText}
            label="Label"
            fullWidth
            inputProps={{
              'aria-label': 'waiver button text',
            }}
            disabled={submitting}
            onChange={onChangeStringHandler(set('buttonText'))}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <BackgroundPicker
            label="Background"
            background={waiver.buttonBackground}
            onChange={set('buttonBackground')}
            disabled={submitting}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ColorPicker
            label="Text Color"
            color={waiver.buttonTextColor}
            onPick={set('buttonTextColor')}
            aria-label="button text color"
            disabled={submitting}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <ColorPicker
            label="Border Color"
            color={waiver.buttonBorderColor}
            onPick={set('buttonBorderColor')}
            aria-label="submit button text color"
            disabled={submitting}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputLabel>Border Radius</InputLabel>
          <Slider
            valueLabelDisplay="auto"
            aria-label="submit button border radius"
            value={waiver.buttonBorderRadius}
            onChange={handleChangeSlider(set('buttonBorderRadius'))}
            step={1}
            min={MIN_BUTTON_BORDER_RADIUS}
            max={MAX_BUTTON_BORDER_RADIUS}
            disabled={submitting}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputLabel>Border Width</InputLabel>
          <Slider
            valueLabelDisplay="auto"
            aria-label="submit button border width"
            value={waiver.buttonBorderWidth}
            onChange={handleChangeSlider(set('buttonBorderWidth'))}
            step={1}
            min={MIN_BUTTON_BORDER_WIDTH}
            max={MAX_BUTTON_BORDER_WIDTH}
            disabled={submitting}
          />
        </Grid>
        <Grid item xs={12}>
          <InputLabel>Size</InputLabel>
          <Slider
            valueLabelDisplay="auto"
            aria-label="submit button width"
            value={waiver.buttonWidth as number}
            onChange={handleChangeSlider(set('buttonWidth'))}
            step={1}
            min={1}
            max={12}
            disabled={submitting}
          />
        </Grid>
      </Grid>
    </>
  )
}
