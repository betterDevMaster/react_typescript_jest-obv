import React, {useEffect, useState} from 'react'
import {Controller, useForm, UseFormMethods} from 'react-hook-form'
import styled from 'styled-components'

import {
  Box,
  Grid,
  InputLabel,
  Slider,
  TextField,
  Typography,
} from '@material-ui/core'

import {
  FiftyBlog,
  MAX_LOGO_SIZE_PERCENT,
  MIN_LOGO_SIZE_PERCENT,
  useFiftyBlogTemplate,
  useFiftyBlogUpdate,
} from 'Event/template/FiftyBlog'
import BackgroundImageUploader from 'Event/template/FiftyBlog/GlobalStylesConfig/BackgroundImageUploader'

import ColorPicker from 'lib/ui/ColorPicker'
import {handleChangeSlider, onChangeCheckedHandler} from 'lib/dom'
import Switch from 'lib/ui/form/Switch'
import ProgressBar, {ProgressBarProps} from 'lib/ui/ProgressBar'

import {SaveButton} from 'organization/Event/DashboardConfig/ComponentConfig'

export interface ProgressBar {
  background: string
  textColor: string
}

const MIN_PROGRESS_BAR_THICKNESS = 30
const MAX_PROGRESS_BAR_THICKNESS = 60
const MIN_PROGRESS_BAR_BORDER_RADIUS = 0
const MAX_PROGRESS_BAR_BORDER_RADIUS = 30

export default function ProgressBarConfig() {
  const {progressBar} = useFiftyBlogTemplate()
  const update = useFiftyBlogUpdate()
  const {control, handleSubmit, watch, setValue, register} = useForm<
    FiftyBlog['progressBar']
  >()

  // Need to init 'requires_attendee_password' on load so the form knows
  // whether to show template config fields.
  const showingConfig = watch('showing')
  useEffect(() => {
    setValue('showing', progressBar.showing)
  }, [progressBar, setValue])

  const submit = (data: FiftyBlog) => {
    update(data)
  }

  const oriProgress = {
    barColor: '#0969d6',
    backgroundColor: '#b1d4f1',
    textColor: '#000000',
    thickness: 30,
    borderRadius: 50,
    checkInTitle: 'Check In:',
    checkInColor: '#000000',
    step1Text: 'Step 1',
    step1Percent: 33,
    step2Text: 'Step 2',
    step2Percent: 66,
    step3Text: 'Step 3',
    step3Percent: 100,
  }

  const changes = watch()
  let localProgressBar = {...progressBar, ...changes}

  // Real time watch for original progress bar and left / right panel
  if (
    Object.keys(changes).includes('progressBar') &&
    Object.keys(changes).length !== 0
  ) {
    oriProgress.barColor = changes.progressBar.barColor
    oriProgress.backgroundColor = changes.progressBar.backgroundColor
    oriProgress.textColor = changes.progressBar.textColor
    oriProgress.thickness = changes.progressBar.thickness
    oriProgress.borderRadius = changes.progressBar.borderRadius
    oriProgress.checkInTitle = changes.progressBar.checkInTitle
    oriProgress.checkInColor = changes.progressBar.checkInColor
    oriProgress.step1Text = changes.progressBar.step1Text
    oriProgress.step1Percent = changes.progressBar.step1Percent
    oriProgress.step2Text = changes.progressBar.step2Text
    oriProgress.step2Percent = changes.progressBar.step2Percent
    oriProgress.step3Text = changes.progressBar.step3Text
    oriProgress.step3Percent = changes.progressBar.step3Percent
    localProgressBar = {...localProgressBar, ...oriProgress}
  }

  return (
    <>
      <Box>
        <Typography variant="h6">Progress Bar</Typography>
      </Box>
      <ProgressBarPreview
        showing={localProgressBar.showing}
        barColor={localProgressBar.barColor}
        text={localProgressBar.step1Text}
        checktitle={localProgressBar.checkInTitle}
        checkcolor={localProgressBar.checkInColor}
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
          </Grid>
          <Config
            control={control}
            showing={showingConfig}
            register={register}
            localProgressBar={localProgressBar}
          />
          <ButtonContainer />
        </Grid>
      </form>
    </>
  )
}

function Config(
  props: {
    showing: boolean
    localProgressBar: FiftyBlog['progressBar']
  } & Pick<UseFormMethods, 'control' | 'register'>,
) {
  const {control, showing, localProgressBar, register} = props
  const {
    checkInLeftPanel,
    checkInRightPanel,
    stepLogoProps,
    stepBackgroundProps,
  } = useFiftyBlogTemplate()

  if (!showing) {
    return null
  }

  return (
    <>
      <Grid item xs={6}>
        <Controller
          name="progressBar.barColor"
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
          name="progressBar.backgroundColor"
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
          name="progressBar.thickness"
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
          name="progressBar.textColor"
          defaultValue={localProgressBar.textColor}
          control={control}
          render={({value, onChange}) => (
            <ColorPicker
              label="Step Text Color"
              color={value}
              onPick={onChange}
              aria-label="text color"
            />
          )}
        />
        <InputLabel>Border Radius</InputLabel>

        <Controller
          name="progressBar.borderRadius"
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
      {/* <Grid container spacing={3}>
        <Grid item xs={6}>
          <TextField
            label="Check In Label Title"
            name="progressBar.checkInTitle"
            defaultValue={localProgressBar.checkInTitle}
            inputProps={{
              'aria-label': 'check in label title',
              ref: register,
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="progressBar.checkInColor"
            defaultValue={localProgressBar.checkInColor}
            control={control}
            render={({ value, onChange }) => (
              <ColorPicker
                label="Checkin Label Color"
                color={value}
                onPick={onChange}
                aria-label="checkin label color"
              />
            )}
          />
        </Grid>
      </Grid> */}
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <TextField
            name="progressBar.step1Text"
            label="Step 1 Text"
            defaultValue={localProgressBar.step1Text}
            fullWidth
            inputProps={{
              ref: register,
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            type="number"
            defaultValue={localProgressBar.step1Percent}
            name="progressBar.step1Percent"
            label="Step 1 Percentage Completed"
            fullWidth
            inputProps={{
              min: 1,
              max: 100,
              ref: register,
            }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <TextField
            name="progressBar.step2Text"
            label="Step 2 Text"
            defaultValue={localProgressBar.step2Text}
            fullWidth
            inputProps={{
              ref: register,
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            type="number"
            defaultValue={localProgressBar.step2Percent}
            name="progressBar.step2Percent"
            label="Step 2 Percentage Completed"
            fullWidth
            inputProps={{
              min: 1,
              max: 100,
              ref: register,
            }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <TextField
            name="progressBar.step3Text"
            label="Step 3 Text"
            fullWidth
            defaultValue={localProgressBar.step3Text}
            inputProps={{
              ref: register,
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            type="number"
            defaultValue={localProgressBar.step3Percent}
            name="progressBar.step3Percent"
            label="Step 3 Percentage Completed"
            fullWidth
            inputProps={{
              min: 1,
              max: 100,
              ref: register,
            }}
          />
        </Grid>
        <BorderedGrid xs={12} md={6} item>
          <Box mb={1}>
            <InputLabel>Left Panel</InputLabel>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box mb={2}>
                <BackgroundImageUploader
                  label="Logo"
                  property="stepLogo"
                  control={control}
                />
              </Box>
              <Box mb={2}>
                <Controller
                  name="stepLogoProps.hidden"
                  defaultValue={stepLogoProps.hidden}
                  control={control}
                  render={({value, onChange}) => (
                    <Switch
                      checked={value}
                      onChange={onChangeCheckedHandler(onChange)}
                      arial-label="set logo mode"
                      labelPlacement="end"
                      color="primary"
                      label="Hide Logo"
                    />
                  )}
                />
              </Box>
              <Box display="flex" flexDirection="column" flex="1" mb={2}>
                <InputLabel>Image Size</InputLabel>
                <Controller
                  name="stepLogoProps.size"
                  defaultValue={stepLogoProps.size}
                  control={control}
                  render={({value, onChange}) => (
                    <Slider
                      valueLabelDisplay="auto"
                      aria-label="logo weight"
                      value={value}
                      onChange={handleChangeSlider(onChange)}
                      step={1}
                      min={MIN_LOGO_SIZE_PERCENT}
                      max={MAX_LOGO_SIZE_PERCENT}
                    />
                  )}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box mb={2}>
                <BackgroundImageUploader
                  label="Background"
                  property="stepBackground"
                  control={control}
                />
              </Box>
              <Box mb={2}>
                <Controller
                  name="stepBackgroundProps.hidden"
                  defaultValue={stepBackgroundProps.hidden}
                  control={control}
                  render={({value, onChange}) => (
                    <Switch
                      checked={value}
                      onChange={onChangeCheckedHandler(onChange)}
                      arial-label="set background mode"
                      labelPlacement="end"
                      color="primary"
                      label="Hide background"
                    />
                  )}
                />
              </Box>
            </Grid>
          </Grid>
          <Controller
            name="checkInLeftPanel.backgroundColor"
            defaultValue={checkInLeftPanel.backgroundColor}
            control={control}
            render={({value, onChange}) => (
              <ColorPicker
                label="Background Color"
                color={value}
                onPick={onChange}
                aria-label="check in left panel background color"
              />
            )}
          />
          <Box>
            <InputLabel>Background Opacity</InputLabel>
            <Controller
              name="checkInLeftPanel.backgroundOpacity"
              defaultValue={checkInLeftPanel.backgroundOpacity}
              control={control}
              render={({value, onChange}) => (
                <Slider
                  key={`checkInLeftPanel-backgroundOpacity-${value}`}
                  min={0}
                  max={1}
                  step={0.1}
                  onChange={handleChangeSlider(onChange)}
                  valueLabelDisplay="auto"
                  defaultValue={value}
                />
              )}
            />
          </Box>
          {/* <Controller
                  name="menu.iconColor"
                  defaultValue={menu.iconColor}
                  control={control}
                  render={({ value, onChange }) => (
                    <ColorPicker
                      label="Menu Icon Color"
                      color={value}
                      onPick={onChange}
                      aria-label="check in menu icon color"
                    />
                  )}
                />
                <Controller
                  name="menu.backgroundColor"
                  defaultValue={menu.backgroundColor}
                  control={control}
                  render={({ value, onChange }) => (
                    <ColorPicker
                      label="Menu Background Color"
                      color={value}
                      onPick={onChange}
                      aria-label="check in menu background color"
                    />
                  )}
                />
                <Controller
                  name="menu.textColor"
                  defaultValue={menu.textColor}
                  control={control}
                  render={({ value, onChange }) => (
                    <ColorPicker
                      label="Menu Text Color"
                      color={value}
                      onPick={onChange}
                      aria-label="check in menu text color"
                    />
                  )}
                /> */}
        </BorderedGrid>
        <Grid xs={12} md={6} item>
          <Box mb={1}>
            <InputLabel>Right Panel</InputLabel>
          </Box>
          <Controller
            name="checkInRightPanel.backgroundColor"
            defaultValue={checkInRightPanel.backgroundColor}
            control={control}
            render={({value, onChange}) => (
              <ColorPicker
                label="Background Color"
                color={value}
                onPick={onChange}
                aria-label="check in right panel background color"
              />
            )}
          />
          <Box mb={2}>
            <InputLabel>Background Opacity</InputLabel>
            <Controller
              name="checkInRightPanel.backgroundOpacity"
              defaultValue={checkInRightPanel.backgroundOpacity}
              control={control}
              render={({value, onChange}) => (
                <Slider
                  key={`checkInRightPanel-backgroundOpacity-${value}`}
                  min={0}
                  max={1}
                  step={0.1}
                  onChange={handleChangeSlider(onChange)}
                  valueLabelDisplay="auto"
                  defaultValue={value}
                />
              )}
            />
          </Box>
          <Controller
            name="checkInRightPanel.textColor"
            defaultValue={checkInRightPanel.textColor}
            control={control}
            render={({value, onChange}) => (
              <ColorPicker
                label="Text Color"
                color={value}
                onPick={onChange}
                aria-label="check in right panel text color"
              />
            )}
          />
        </Grid>
      </Grid>
    </>
  )
}

export function ProgressBarPreview(props: Omit<ProgressBarProps, 'value'>) {
  const [progress, setProgress] = useState(10)

  useEffect(() => {
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

const BorderedGrid = styled(Grid)`
  border-right: 1px dashed;
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    border-right: none;
  }
`

const ButtonContainer = styled(SaveButton)`
  margin-top: ${(props) => props.theme.spacing[10]} !important;
`
