import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import InputLabel from '@material-ui/core/InputLabel'
import Slider from '@material-ui/core/Slider'
import {useEvent} from 'Event/EventProvider'
import {
  FiftyBlog,
  useFiftyBlogTemplate,
  useFiftyBlogUpdate,
} from 'Event/template/FiftyBlog'
import {handleChangeSlider, onChangeCheckedHandler} from 'lib/dom'
import ColorPicker from 'lib/ui/ColorPicker'
import Switch from 'lib/ui/form/Switch'
import EventImageUpload from 'organization/Event/DashboardConfig/EventImageUpload'
import {SectionTitle} from 'organization/Event/Page'
import Page from 'organization/Event/Page'
import Layout from 'organization/user/Layout'
import React from 'react'
import {useForm, Controller} from 'react-hook-form'
import Button from '@material-ui/core/Button'

export default function GlobalStylesConfig() {
  const update = useFiftyBlogUpdate()
  const template = useFiftyBlogTemplate()

  const {event} = useEvent()

  const {handleSubmit, control} = useForm()

  const submit = (data: FiftyBlog) => {
    update(data)
  }

  return (
    <Layout>
      <Page>
        <SectionTitle>Global Styles</SectionTitle>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box mb={2}>
              <EventImageUpload
                label="Logo"
                property="logo"
                current={event.logo}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box mb={2}>
              <EventImageUpload
                label="Mobile Logo"
                property="mobile_logo"
                current={event.mobile_logo}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box mb={2}>
              <EventImageUpload
                label="Background"
                property="dashboard_background"
                current={event.dashboard_background}
                width={1920}
                height={1200}
                canResize
              />
            </Box>
          </Grid>
        </Grid>

        <form onSubmit={handleSubmit(submit)}>
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
              name="accentColor"
              defaultValue={template.accentColor}
              control={control}
              render={({value, onChange}) => (
                <ColorPicker
                  label="Accent Color"
                  color={value}
                  onPick={onChange}
                  aria-label="accent color"
                />
              )}
            />
          </Box>
          <Box mb={2}>
            <Controller
              name="background.color"
              defaultValue={template.background?.color}
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
                valueLabelFormat={() => (
                  <div>{template.background.opacity}</div>
                )}
                aria-label="background color opacity"
              />
            )}
          />

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
          <Box mb={2}>
            <Button
              variant="contained"
              aria-label="save"
              type="submit"
              color="primary"
            >
              Save
            </Button>
          </Box>
        </form>
      </Page>
    </Layout>
  )
}
