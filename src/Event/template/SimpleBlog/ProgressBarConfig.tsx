import React, {useEffect} from 'react'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Slider from '@material-ui/core/Slider'
import ColorPicker from 'lib/ui/ColorPicker'
import TextField from '@material-ui/core/TextField'
import {
  handleChangeSlider,
  onChangeCheckedHandler,
  onChangeNumberHandler,
} from 'lib/dom'
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

const MIN_PROGRESS_BAR_THICKNESS = 30
const MAX_PROGRESS_BAR_THICKNESS = 60
const MIN_PROGRESS_BAR_BORDER_RADIUS = 0
const MAX_PROGRESS_BAR_BORDER_RADIUS = 30

export default function ProgressBarConfig() {
  const {progressBar} = useSimpleBlogTemplate()
  const update = useSimpleBlogUpdate()
  const {control, handleSubmit, watch, setValue, register} = useForm<
    SimpleBlog['progressBar']
  >()

  // Need to init 'requires_attendee_password' on load so the form knows
  // whether to show template config fields.
  const showingConfig = watch('showing')
  useEffect(() => {
    setValue('showing', progressBar.showing)
  }, [progressBar, setValue])

  const submit = (data: SimpleBlog['progressBar']) => {
    update({progressBar: data})
  }

  const changes = watch()
  const localProgressBar = {...progressBar, ...changes}

  return (
    <>
      <Box mb={1}>
        <Typography variant="h6">Progress Bar</Typography>
      </Box>
      <ProgressBarPreview
        showing={localProgressBar.showing}
        barColor={localProgressBar.barColor}
        text={localProgressBar.step1Text}
        backgroundColor={localProgressBar.backgroundColor}
        textColor={localProgressBar.textColor}
        thickness={localProgressBar.thickness}
        borderRadius={localProgressBar.borderRadius}
      />
      <form onSubmit={handleSubmit(submit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Controller
              name="showing"
              defaultValue={localProgressBar.showing}
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
          </Grid>
          <Config
            control={control}
            showing={showingConfig}
            register={register}
            localProgressBar={localProgressBar}
          />
        </Grid>
      </form>
    </>
  )
}

function Config(
  props: {
    showing: boolean
    localProgressBar: SimpleBlog['progressBar']
  } & Pick<UseFormMethods, 'control' | 'register'>,
) {
  const {control, showing, localProgressBar, register} = props

  if (!showing) {
    return null
  }

  return (
    <>
      <Grid item xs={6}>
        <Controller
          name="barColor"
          defaultValue={localProgressBar.barColor}
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
          defaultValue={localProgressBar.backgroundColor}
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
          defaultValue={localProgressBar.thickness}
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
          defaultValue={localProgressBar.textColor}
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
        <InputLabel>Border Radius</InputLabel>

        <Controller
          name="borderRadius"
          defaultValue={localProgressBar.borderRadius}
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
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <TextField
            name="step1Text"
            label="Step 1 Text"
            fullWidth
            inputProps={{
              ref: register,
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="step1Percent"
            defaultValue={localProgressBar.step1Percent}
            control={control}
            render={({value, onChange}) => (
              <TextField
                type="number"
                InputProps={{inputProps: {min: 0, max: 100}}}
                name="step1Percent"
                label="Step 1 Percentage Completed"
                fullWidth
                value={value}
                onChange={onChangeNumberHandler(onChange)}
              />
            )}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <TextField
            name="step2Text"
            label="Step 2 Text"
            fullWidth
            inputProps={{
              ref: register,
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="step2Percent"
            defaultValue={localProgressBar.step1Percent}
            control={control}
            render={({value, onChange}) => (
              <TextField
                type="number"
                InputProps={{inputProps: {min: 0, max: 100}}}
                name="step2Percent"
                label="Step 2 Percentage Completed"
                fullWidth
                value={value}
                onChange={onChangeNumberHandler(onChange)}
              />
            )}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <TextField
            name="step3Text"
            label="Step 3 Text"
            fullWidth
            inputProps={{
              ref: register,
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="step3Percent"
            defaultValue={localProgressBar.step1Percent}
            control={control}
            render={({value, onChange}) => (
              <TextField
                type="number"
                InputProps={{inputProps: {min: 0, max: 100}}}
                name="step3Percent"
                label="Step 3 Percentage Completed"
                fullWidth
                value={value}
                onChange={onChangeNumberHandler(onChange)}
              />
            )}
          />
        </Grid>
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
