import React, {useEffect, useState} from 'react'
import InputLabel from '@material-ui/core/InputLabel'
import Typography from '@material-ui/core/Typography'
import ColorPicker from 'lib/ui/ColorPicker'
import Grid from '@material-ui/core/Grid'
import Slider from '@material-ui/core/Slider'
import {handleChangeSlider, onChangeStringHandler} from 'lib/dom'
import TextField from '@material-ui/core/TextField'
import Box from '@material-ui/core/Box'
import {colors} from 'lib/ui/theme'
import {SimpleBlog, useSimpleBlog} from 'Event/template/SimpleBlog'

const MIN_BUTTON_BORDER_RADIUS = 0
const MAX_BUTTON_BORDER_RADIUS = 100

const MIN_BUTTON_BORDER_WIDTH = 0
const MAX_BUTTON_BORDER_WIDTH = 20

const DEFAULT_WAIVER_PROPS: NonNullable<SimpleBlog['waiver']> = {
  buttonText: 'Submit',
  buttonBackground: colors.primary,
  buttonTextColor: '#FFFFFF',
  buttonBorderColor: colors.primary,
  buttonBorderRadius: 4,
  buttonBorderWidth: 1,
  buttonWidth: 12,
}
export default function TemplateFields(props: {submitting: boolean}) {
  const {submitting} = props
  const {template, update} = useSimpleBlog()
  const updateWaiverTemplate = update.object('waiver')

  const [waiver, setWaiver] = useState(DEFAULT_WAIVER_PROPS)

  useEffect(() => {
    if (!template?.waiver) {
      return
    }
    setWaiver(template.waiver)
  }, [template])

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
              'aria-label': 'tech check submit button label',
            }}
            disabled={submitting}
            onChange={onChangeStringHandler(updateWaiverTemplate('buttonText'))}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <ColorPicker
            label="Background Color"
            color={waiver.buttonBackground}
            onPick={updateWaiverTemplate('buttonBackground')}
            aria-label="submit button background color"
            disabled={submitting}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ColorPicker
            label="Text Color"
            color={waiver.buttonTextColor}
            onPick={updateWaiverTemplate('buttonTextColor')}
            aria-label="button text color"
            disabled={submitting}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <ColorPicker
            label="Border Color"
            color={waiver.buttonBorderColor}
            onPick={updateWaiverTemplate('buttonBorderColor')}
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
            onChange={handleChangeSlider(
              updateWaiverTemplate('buttonBorderRadius'),
            )}
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
            onChange={handleChangeSlider(
              updateWaiverTemplate('buttonBorderWidth'),
            )}
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
            onChange={handleChangeSlider(updateWaiverTemplate('buttonWidth'))}
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
