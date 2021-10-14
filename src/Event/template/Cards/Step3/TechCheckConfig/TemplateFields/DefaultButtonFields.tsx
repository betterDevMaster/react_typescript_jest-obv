import React from 'react'
import InputLabel from '@material-ui/core/InputLabel'
import ColorPicker from 'lib/ui/ColorPicker'
import Grid from '@material-ui/core/Grid'
import Slider from '@material-ui/core/Slider'
import {handleChangeSlider, onChangeStringHandler} from 'lib/dom'
import TextField from '@material-ui/core/TextField'
import {TemplateFieldProps} from 'Event/template/Cards/Step3/TechCheckConfig/TemplateFields'
import BackgroundPicker from 'lib/ui/form/BackgroundPicker'

const MIN_BUTTON_BORDER_RADIUS = 0
const MAX_BUTTON_BORDER_RADIUS = 100

const MIN_BUTTON_BORDER_WIDTH = 0
const MAX_BUTTON_BORDER_WIDTH = 20

export default function DefaultButtonFields(props: TemplateFieldProps) {
  const {techCheck, set, submitting} = props

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            value={techCheck.buttonText || ''}
            label="Label"
            fullWidth
            inputProps={{
              'aria-label': 'tech check submit button label',
            }}
            disabled={submitting}
            onChange={onChangeStringHandler(set('buttonText'))}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <BackgroundPicker
            label="Background"
            background={techCheck.buttonBackground}
            onChange={set('buttonBackground')}
            disabled={submitting}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ColorPicker
            label="Text Color"
            color={techCheck.buttonTextColor}
            onPick={set('buttonTextColor')}
            aria-label="button text color"
            disabled={submitting}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <ColorPicker
            label="Border Color"
            color={techCheck.buttonBorderColor}
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
            value={techCheck.buttonBorderRadius}
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
            value={techCheck.buttonBorderWidth}
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
            value={techCheck.buttonWidth as number}
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
