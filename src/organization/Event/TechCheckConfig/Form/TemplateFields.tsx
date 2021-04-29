import React from 'react'
import InputLabel from '@material-ui/core/InputLabel'
import Typography from '@material-ui/core/Typography'
import ColorPicker from 'lib/ui/ColorPicker'
import Grid from '@material-ui/core/Grid'
import Slider from '@material-ui/core/Slider'
import {handleChangeSlider, onChangeStringHandler} from 'lib/dom'
import TextField from '@material-ui/core/TextField'
import Box from '@material-ui/core/Box'
import {Template} from 'Event/template'

const MIN_BUTTON_BORDER_RADIUS = 0
const MAX_BUTTON_BORDER_RADIUS = 100

const MIN_BUTTON_BORDER_WIDTH = 0
const MAX_BUTTON_BORDER_WIDTH = 20

type TechCheckTemplateProps = NonNullable<Template['techCheck']>

type TechCheckTemplatePropSetter = <K extends keyof TechCheckTemplateProps>(
  key: K,
) => (value: TechCheckTemplateProps[K]) => void

export default function TemplateFields(props: {
  techCheck: TechCheckTemplateProps
  set: TechCheckTemplatePropSetter
  submitting: boolean
}) {
  const {techCheck, set, submitting} = props

  return (
    <>
      <Box mb={1}>
        <Typography variant="h6">Button Styles</Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            value={techCheck.buttonText}
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
          <ColorPicker
            label="Background Color"
            color={techCheck.buttonBackground}
            onPick={set('buttonBackground')}
            aria-label="submit button background color"
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
      <Box mb={1}>
        <Typography variant="h6">Offline Dialog</Typography>
      </Box>
      <TextField
        value={techCheck.offlineTitle}
        label="Title"
        fullWidth
        inputProps={{
          'aria-label': 'tech check offline title',
        }}
        onChange={onChangeStringHandler(set('offlineTitle'))}
        disabled={submitting}
      />
      <TextField
        value={techCheck.offlineDescription}
        label="Description"
        fullWidth
        inputProps={{
          'aria-label': 'tech check offline description',
        }}
        multiline
        rows="4"
        onChange={onChangeStringHandler(set('offlineDescription'))}
        disabled={submitting}
      />
    </>
  )
}
