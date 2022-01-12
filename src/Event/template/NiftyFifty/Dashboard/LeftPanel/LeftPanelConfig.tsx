import React from 'react'
import {Controller, useForm} from 'react-hook-form'

import {Box, Grid, InputLabel, Slider} from '@material-ui/core'

import {
  NiftyFifty,
  MAX_LOGO_SIZE_PERCENT,
  MIN_LOGO_SIZE_PERCENT,
  useNiftyFiftyTemplate,
  useNiftyFiftyUpdate,
} from 'Event/template/NiftyFifty'
import BackgroundImageUploader from 'Event/template/NiftyFifty/GlobalStylesConfig/BackgroundImageUploader'

import {handleChangeSlider, onChangeCheckedHandler} from 'lib/dom'
import ColorPicker from 'lib/ui/ColorPicker'
import Switch from 'lib/ui/form/Switch'
import {numberFormat} from 'lib/numberFormat'

import ComponentConfig, {
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'

export default function LeftPanelConfig(props: {
  isVisible: boolean
  onClose: () => void
}) {
  const {isVisible, onClose} = props

  const update = useNiftyFiftyUpdate()
  const {
    dashboardBackgroundProps,
    dashboardLogoProps,
    leftPanel,
  } = useNiftyFiftyTemplate()
  const {control, handleSubmit} = useForm()

  const submit = (data: NiftyFifty) => {
    update(data)
    onClose()
  }

  return (
    <>
      <ComponentConfig
        isVisible={isVisible}
        onClose={onClose}
        title="Left Panel Config"
      >
        <form onSubmit={handleSubmit(submit)}>
          <Grid container justify="center" spacing={2}>
            <Grid item xs={12} md={6}>
              <Box mb={2}>
                <BackgroundImageUploader
                  label="Logo"
                  property="dashboardLogo"
                  control={control}
                />
              </Box>
              <Box mb={2}>
                <Controller
                  name="dashboardLogoProps.hidden"
                  defaultValue={dashboardLogoProps.hidden}
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
                  name="dashboardLogoProps.size"
                  defaultValue={dashboardLogoProps.size}
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
                  property="dashboardBackground"
                  control={control}
                />
              </Box>
              <Box mb={2}>
                <Controller
                  name="dashboardBackgroundProps.hidden"
                  defaultValue={dashboardBackgroundProps.hidden}
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
          <Box display="flex" flexDirection="row" flex="2" mb={2}>
            <Box flex="1" mr={2}>
              <Controller
                name="leftPanel.barTextColor"
                defaultValue={leftPanel.barTextColor}
                control={control}
                render={({value, onChange}) => (
                  <ColorPicker
                    label="Menu Color"
                    color={value}
                    onPick={onChange}
                    aria-label="left panel bar text color"
                  />
                )}
              />
            </Box>
            <Box flex="1">
              <Controller
                name="leftPanel.menuTextColor"
                defaultValue={leftPanel.menuTextColor}
                control={control}
                render={({value, onChange}) => (
                  <ColorPicker
                    label="Menu Text Color"
                    color={value}
                    onPick={onChange}
                    aria-label="left panel menu text color"
                  />
                )}
              />
            </Box>
          </Box>
          <Box display="flex" flexDirection="row" flex="2" mb={2}>
            <Box flex="1" mr={2}>
              <Controller
                name="leftPanel.barBackgroundColor"
                defaultValue={leftPanel.barBackgroundColor}
                control={control}
                render={({value, onChange}) => (
                  <ColorPicker
                    label="Menu Background Color"
                    color={value}
                    onPick={onChange}
                    aria-label="left panel bar background color"
                  />
                )}
              />
            </Box>
            <Box flex="1">
              <InputLabel>Menu Background Opacity</InputLabel>
              <Controller
                name="leftPanel.barBackgroundOpacity"
                defaultValue={leftPanel.barBackgroundOpacity}
                control={control}
                render={({value, onChange}) => (
                  <Slider
                    min={0}
                    max={1}
                    step={0.1}
                    valueLabelFormat={(num) => numberFormat(num, 10)}
                    onChange={handleChangeSlider(onChange)}
                    valueLabelDisplay="auto"
                    value={value}
                  />
                )}
              />
            </Box>
          </Box>
          <Box mb={2}>
            <Controller
              name="leftPanel.backgroundColor"
              defaultValue={leftPanel.backgroundColor}
              control={control}
              render={({value, onChange}) => (
                <ColorPicker
                  label="Background Color"
                  color={value}
                  onPick={onChange}
                  aria-label="left panel background color"
                />
              )}
            />
          </Box>
          <Box mb={2}>
            <InputLabel>Background Opacity</InputLabel>
            <Controller
              name="leftPanel.backgroundOpacity"
              defaultValue={leftPanel.backgroundOpacity}
              control={control}
              render={({value, onChange}) => (
                <Slider
                  min={0}
                  max={1}
                  step={0.1}
                  valueLabelFormat={(num) => numberFormat(num, 10)}
                  onChange={handleChangeSlider(onChange)}
                  valueLabelDisplay="auto"
                  value={value}
                />
              )}
            />
          </Box>
          <SaveButton />
        </form>
      </ComponentConfig>
    </>
  )
}
