import React, {useEffect} from 'react'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Slider from '@material-ui/core/Slider'
import ColorPicker from 'lib/ui/ColorPicker'
import {handleChangeSlider, onChangeCheckedHandler} from 'lib/dom'
import {
  SimpleBlog,
  useSimpleBlogTemplate,
  useSimpleBlogUpdate,
} from 'Event/template/SimpleBlog'
import Switch from 'lib/ui/form/Switch'
import ProgressBar, {ProgressBarProps} from 'lib/ui/ProgressBar'
import {Controller, useForm, UseFormMethods} from 'react-hook-form'
import Button from '@material-ui/core/Button'
import InputLabel from '@material-ui/core/InputLabel'

export interface ProgressBar {
  background: string
  textColor: string
}

const MIN_PROGRESS_BAR_THICKNESS = 5
const MAX_PROGRESS_BAR_THICKNESS = 50
const MIN_PROGRESS_BAR_BORDER_RADIUS = 0
const MAX_PROGRESS_BAR_BORDER_RADIUS = 25

export default function ProgressBarConfig() {
  const {progressBar} = useSimpleBlogTemplate()
  const update = useSimpleBlogUpdate()
  const {control, handleSubmit, watch, setValue} = useForm()

  // Need to init 'requires_attendee_password' on load so the form knows
  // whether to show template config fields.
  const showingConfig = watch('showing')
  useEffect(() => {
    setValue('showing', progressBar.showing)
  }, [progressBar, setValue])

  const submit = (data: SimpleBlog['progressBar']) => {
    update({progressBar: data})
  }

  return (
    <>
      <Box mb={1}>
        <Typography variant="h6">Progress Bar</Typography>
      </Box>
      <ProgressBarPreview
        showing={progressBar.showing}
        barColor={progressBar.barColor}
        backgroundColor={progressBar.backgroundColor}
        textColor={progressBar.textColor}
        thickness={progressBar.thickness}
        borderRadius={progressBar.borderRadius}
      />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <form onSubmit={handleSubmit(submit)}>
            <Controller
              name="showing"
              defaultValue={progressBar.showing}
              control={control}
              render={({value, onChange}) => (
                <Switch
                  checked={value}
                  onChange={onChangeCheckedHandler(onChange)}
                  label="Show"
                  labelPlacement="end"
                  color="primary"
                  aria-label="progress bar visible"
                />
              )}
            />
            <Button
              variant="contained"
              aria-label="save"
              type="submit"
              color="primary"
            >
              Save
            </Button>
          </form>
        </Grid>
        <Config control={control} showing={showingConfig} />
      </Grid>
    </>
  )
}

function Config(props: {showing: boolean} & Pick<UseFormMethods, 'control'>) {
  const {control, showing} = props
  const {progressBar} = useSimpleBlogTemplate()

  if (!showing) {
    return null
  }

  return (
    <>
      <Grid item xs={6}>
        <Controller
          name="barColor"
          defaultValue={progressBar.barColor}
          control={control}
          render={({value, onChange}) => (
            <ColorPicker
              label="Bar Color"
              color={value}
              onPick={onChange}
              aria-label="bar color"
            />
          )}
        />
        <Controller
          name="backgroundColor"
          defaultValue={progressBar.backgroundColor}
          control={control}
          render={({value, onChange}) => (
            <ColorPicker
              label="Background Color"
              color={value}
              onPick={onChange}
              aria-label="bar background color"
            />
          )}
        />
        <InputLabel>Thickness</InputLabel>
        <Controller
          name="thickness"
          defaultValue={progressBar.thickness}
          control={control}
          render={({value, onChange}) => (
            <Slider
              valueLabelDisplay="auto"
              aria-label="progress bar thickness"
              value={value}
              onChange={handleChangeSlider(onChange)}
              step={1}
              min={MIN_PROGRESS_BAR_THICKNESS}
              max={MAX_PROGRESS_BAR_THICKNESS}
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name="textColor"
          defaultValue={progressBar.textColor}
          control={control}
          render={({value, onChange}) => (
            <ColorPicker
              label="Text Color"
              color={value}
              onPick={onChange}
              aria-label="text color"
            />
          )}
        />
        <InputLabel>Thickness</InputLabel>

        <Controller
          name="borderRadius"
          defaultValue={progressBar.borderRadius}
          control={control}
          render={({value, onChange}) => (
            <Slider
              valueLabelDisplay="auto"
              aria-label="progress bar border"
              value={value}
              onChange={handleChangeSlider(onChange)}
              step={1}
              min={MIN_PROGRESS_BAR_BORDER_RADIUS}
              max={MAX_PROGRESS_BAR_BORDER_RADIUS}
            />
          )}
        />
      </Grid>
    </>
  )
}

export function ProgressBarPreview(props: Omit<ProgressBarProps, 'value'>) {
  const [progress, setProgress] = React.useState(10)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 10 : prevProgress + 10,
      )
    }, 800)
    return () => {
      clearInterval(timer)
    }
  }, [])

  return <ProgressBar {...props} value={progress} />
}
