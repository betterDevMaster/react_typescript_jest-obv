import React from 'react'
import {Controller, useForm} from 'react-hook-form'

import {Box} from '@material-ui/core'

import {
  FiftyBlog,
  useFiftyBlogTemplate,
  useFiftyBlogUpdate,
} from 'Event/template/FiftyBlog'

import ColorPicker from 'lib/ui/ColorPicker'
import Switch from 'lib/ui/form/Switch'
import {onChangeCheckedHandler} from 'lib/dom'

import Page, {SectionTitle} from 'organization/Event/Page'
import Layout from 'organization/user/Layout'
import {SaveButton} from 'organization/Event/DashboardConfig/ComponentConfig'

type GlobalStylesFormData = Pick<
  FiftyBlog,
  'textColor' | 'isDarkMode' | 'linkColor' | 'linkUnderline'
> &
  FiftyBlog['background']

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
          {/* <Box mb={2}>
            <Controller
              name="isDarkMode"
              defaultValue={template.isDarkMode}
              control={control}
              render={({ value, onChange }) => (
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
          </Box> */}
          {/* <Box mb={2}>
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
          /> */}

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
