import Box from '@material-ui/core/Box'
import {Cards, useCardsTemplate, useCardsUpdate} from 'Event/template/Cards'
import ColorPicker from 'lib/ui/ColorPicker'
import Switch from 'lib/ui/form/Switch'
import {SectionTitle} from 'organization/Event/Page'
import React from 'react'
import Grid from '@material-ui/core/Grid'
import InputLabel from '@material-ui/core/InputLabel'
import Slider from '@material-ui/core/Slider'
import {handleChangeSlider, onChangeCheckedHandler} from 'lib/dom'
import BackgroundImageUploader from 'Event/template/Cards/GlobalStylesConfig/BackgroundImageUploader'
import Layout from 'organization/user/Layout'
import Page from 'organization/Event/Page'
import {SaveButton} from 'organization/Event/DashboardConfig/ComponentConfig'
import {Controller, useForm} from 'react-hook-form'

type GlobalStylesFormData = Pick<
  Cards,
  'textColor' | 'isDarkMode' | 'linkColor' | 'linkUnderline'
> &
  Cards['background']

export default function GlobalStylesConfig() {
  const template = useCardsTemplate()
  const updateBackground = useCardsUpdate()

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
          <Grid container justify="center" spacing={10}>
            <Grid item xs={4} md={2}>
              <Box mb={2}>
                <BackgroundImageUploader
                  label="Background 1"
                  property="backgroundImage1"
                  control={control}
                />
              </Box>
            </Grid>
            <Grid item xs={4} md={2}>
              <Box mb={2}>
                <BackgroundImageUploader
                  label="Background 2"
                  property="backgroundImage2"
                  control={control}
                />
              </Box>
            </Grid>
            <Grid item xs={4} md={2}>
              <Box mb={2}>
                <BackgroundImageUploader
                  label="Background 3"
                  property="backgroundImage3"
                  control={control}
                />
              </Box>
            </Grid>
            <Grid item xs={4} md={2}>
              <Box mb={2}>
                <BackgroundImageUploader
                  label="Background 4"
                  property="backgroundImage4"
                  control={control}
                />
              </Box>
            </Grid>
            <Grid item xs={4} md={2}>
              <Box mb={2}>
                <BackgroundImageUploader
                  label="Background 5"
                  property="backgroundImage5"
                  control={control}
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
