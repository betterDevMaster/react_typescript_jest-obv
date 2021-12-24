import React from 'react'
import {Controller, useForm} from 'react-hook-form'

import {Box, Grid, InputLabel, Slider} from '@material-ui/core'

import {
  FiftyBlog,
  useFiftyBlogTemplate,
  useFiftyBlogUpdate,
} from 'Event/template/FiftyBlog'
import BackgroundImageUploader from 'Event/template/FiftyBlog/GlobalStylesConfig/BackgroundImageUploader'

import ColorPicker from 'lib/ui/ColorPicker'
import Switch from 'lib/ui/form/Switch'
import {handleChangeSlider, onChangeCheckedHandler} from 'lib/dom'

import Page, {SectionTitle} from 'organization/Event/Page'
import Layout from 'organization/user/Layout'
import {SaveButton} from 'organization/Event/DashboardConfig/ComponentConfig'

type GlobalStylesFormData = Pick<
  FiftyBlog,
  'textColor' | 'isDarkMode' | 'linkColor' | 'linkUnderline'
> &
  FiftyBlog['background']

const MAX_LOGO_SIZE_PERCENT = 100
const MIN_LOGO_SIZE_PERCENT = 20

export default function GlobalStylesConfig() {
  const template = useFiftyBlogTemplate()
  const updateBackground = useFiftyBlogUpdate()

  const {handleSubmit, control} = useForm()

  const save = (data: GlobalStylesFormData) => {
    updateBackground({
      ...data,
    })
  }
  return (
    <Layout>
      <Page>
        <SectionTitle>Global Styles</SectionTitle>
        <form onSubmit={handleSubmit(save)}>
          <Grid container justify="center" spacing={2}>
            <Grid item xs={4} md={3}>
              <Box mb={2}>
                <BackgroundImageUploader
                  label="Dashboard Logo"
                  property="dashboardLogo"
                  control={control}
                />
              </Box>
              <Box mb={2}>
                <Controller
                  name="dashboardLogoProps.hidden"
                  defaultValue={template.dashboardLogoProps.hidden}
                  control={control}
                  render={({value, onChange}) => (
                    <Switch
                      checked={value}
                      onChange={onChangeCheckedHandler(onChange)}
                      arial-label="set dashboard logo mode"
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
                  defaultValue={template.dashboardLogoProps.size}
                  control={control}
                  render={({value, onChange}) => (
                    <Slider
                      valueLabelDisplay="auto"
                      aria-label="dashboard logo weight"
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
            <Grid item xs={4} md={3}>
              <Box mb={2}>
                <BackgroundImageUploader
                  label="Dashboard Background"
                  property="dashboardBackground"
                  control={control}
                />
              </Box>
              <Box mb={2}>
                <Controller
                  name="dashboardBackgroundProps.hidden"
                  defaultValue={template.dashboardBackgroundProps.hidden}
                  control={control}
                  render={({value, onChange}) => (
                    <Switch
                      checked={value}
                      onChange={onChangeCheckedHandler(onChange)}
                      arial-label="set dashboard background mode"
                      labelPlacement="end"
                      color="primary"
                      label="Hide background"
                    />
                  )}
                />
              </Box>
            </Grid>
            <Grid item xs={4} md={3}>
              <Box mb={2}>
                <BackgroundImageUploader
                  label="Step Logo"
                  property="stepLogo"
                  control={control}
                />
              </Box>
              <Box mb={2}>
                <Controller
                  name="stepLogoProps.hidden"
                  defaultValue={template.stepLogoProps.hidden}
                  control={control}
                  render={({value, onChange}) => (
                    <Switch
                      checked={value}
                      onChange={onChangeCheckedHandler(onChange)}
                      arial-label="set step logo mode"
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
                  defaultValue={template.stepLogoProps.size}
                  control={control}
                  render={({value, onChange}) => (
                    <Slider
                      valueLabelDisplay="auto"
                      aria-label="step logo weight"
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
            <Grid item xs={4} md={3}>
              <Box mb={2}>
                <BackgroundImageUploader
                  label="Step Background"
                  property="stepBackground"
                  control={control}
                />
              </Box>
              <Box mb={2}>
                <Controller
                  name="stepBackgroundProps.hidden"
                  defaultValue={template.stepBackgroundProps.hidden}
                  control={control}
                  render={({value, onChange}) => (
                    <Switch
                      checked={value}
                      onChange={onChangeCheckedHandler(onChange)}
                      arial-label="set step background mode"
                      labelPlacement="end"
                      color="primary"
                      label="Hide background"
                    />
                  )}
                />
              </Box>
            </Grid>
          </Grid>
          <Box mb={2}>
            <Controller
              name="isDarkMode"
              defaultValue={template.isDarkMode}
              control={control}
              render={({value, onChange}) => (
                <Switch
                  checked={value}
                  onChange={onChangeCheckedHandler(onChange)}
                  arial-label="set dark mode"
                  labelPlacement="end"
                  color="primary"
                  label="Dark Mode"
                />
              )}
            />
          </Box>
          <Box mb={2}>
            <Controller
              name="background.color"
              defaultValue={template.background.color}
              control={control}
              render={({value, onChange}) => (
                <ColorPicker
                  label="Background Color"
                  color={value}
                  onPick={onChange}
                  aria-label="dashboard background color"
                />
              )}
            />
          </Box>
          <InputLabel>Background Color Opacity</InputLabel>
          <Controller
            name="background.opacity"
            defaultValue={template.background.opacity}
            control={control}
            render={({value, onChange}) => (
              <Slider
                min={0}
                max={1}
                step={0.1}
                onChange={handleChangeSlider(onChange)}
                valueLabelDisplay="auto"
                value={value}
                valueLabelFormat={() => <div>{value}</div>}
                aria-label="background color opacity"
              />
            )}
          />

          <Box mb={2}>
            <Controller
              name="textColor"
              defaultValue={template.textColor}
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
          </Box>
          <Box mb={2}>
            <Controller
              name="linkColor"
              defaultValue={template.linkColor}
              control={control}
              render={({value, onChange}) => (
                <ColorPicker
                  label="Link Color"
                  color={value}
                  onPick={onChange}
                  aria-label="link color"
                />
              )}
            />
          </Box>
          <Box mb={2}>
            <Controller
              name="linkUnderline"
              defaultValue={template.linkUnderline}
              control={control}
              render={({value, onChange}) => (
                <Switch
                  label="Link Underline"
                  checked={value}
                  onChange={onChangeCheckedHandler(onChange)}
                  labelPlacement="end"
                  color="primary"
                />
              )}
            />
          </Box>
          <SaveButton />
        </form>
      </Page>
    </Layout>
  )
}
