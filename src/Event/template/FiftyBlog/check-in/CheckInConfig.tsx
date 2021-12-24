import React from 'react'
import {Controller, useForm} from 'react-hook-form'
import styled from 'styled-components'

import {Box, Grid, InputLabel, Slider, Typography} from '@material-ui/core'

import {
  FiftyBlog,
  useFiftyBlogTemplate,
  useFiftyBlogUpdate,
} from 'Event/template/FiftyBlog'

import ProgressBarConfig from './ProgressBarConfig'

import {handleChangeSlider} from 'lib/dom'
import ColorPicker from 'lib/ui/ColorPicker'

import {SectionTitle} from 'organization/Event/Page'
import Page from 'organization/Event/Page'
import Layout from 'organization/user/Layout'
import {SaveButton} from 'organization/Event/DashboardConfig/ComponentConfig'

export type Step = 1 | 2 | 3

export default function CheckInConfig() {
  const update = useFiftyBlogUpdate()
  const template = useFiftyBlogTemplate()

  const {handleSubmit, control} = useForm()

  const submit = (data: FiftyBlog) => {
    update(data)
  }

  return (
    <Layout>
      <Page>
        <Box mb={2}>
          <SectionTitle>Check In</SectionTitle>
        </Box>
        <Box mb={6}>
          <ProgressBarConfig />
          <form onSubmit={handleSubmit(submit)}>
            <Box mt={4} mb={1}>
              <Typography variant="h6">General</Typography>
            </Box>
            <Grid container spacing={6}>
              <BorderedGrid xs={12} md={6} item>
                <Box mb={1}>
                  <InputLabel>Left Panel</InputLabel>
                </Box>
                <Controller
                  name="checkInLeftPanel.backgroundColor"
                  defaultValue={template.checkInLeftPanel.backgroundColor}
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
                <Box mb={2}>
                  <InputLabel>Background Opacity</InputLabel>
                  <Controller
                    name="checkInLeftPanel.backgroundOpacity"
                    defaultValue={template.checkInLeftPanel.backgroundOpacity}
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
                <Controller
                  name="menu.iconColor"
                  defaultValue={template.menu.iconColor}
                  control={control}
                  render={({value, onChange}) => (
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
                  defaultValue={template.menu.backgroundColor}
                  control={control}
                  render={({value, onChange}) => (
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
                  defaultValue={template.menu.textColor}
                  control={control}
                  render={({value, onChange}) => (
                    <ColorPicker
                      label="Menu Text Color"
                      color={value}
                      onPick={onChange}
                      aria-label="check in menu text color"
                    />
                  )}
                />
              </BorderedGrid>
              <Grid xs={12} md={6} item>
                <Box mb={1}>
                  <InputLabel>Right Panel</InputLabel>
                </Box>
                <Controller
                  name="checkInRightPanel.backgroundColor"
                  defaultValue={template.checkInRightPanel.backgroundColor}
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
                    defaultValue={template.checkInRightPanel.backgroundOpacity}
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
                  defaultValue={template.checkInRightPanel.textColor}
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
          </form>
        </Box>
        <SaveButton />
      </Page>
    </Layout>
  )
}

const BorderedGrid = styled(Grid)`
  border-right: 1px dashed;
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    border-right: none;
  }
`
