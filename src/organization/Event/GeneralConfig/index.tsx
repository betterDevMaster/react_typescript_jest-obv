import React from 'react'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Slider from '@material-ui/core/Slider'

import ColorPicker from 'lib/ui/ColorPicker'
import {useEvent} from 'Event/EventProvider'
import TemplateProvider, {
  useTemplate,
  useUpdateObject,
} from 'Event/TemplateProvider'
import ProgressBarPreview from 'organization/Event/GeneralConfig/ProgressBarPreview'
import LoginConfig from 'organization/Event/GeneralConfig/LoginConfig'
import SelectTemplateForm from 'organization/Event/DashboardConfig/SelectTemplateForm'
import Layout from 'organization/user/Layout'
import Page from 'organization/Event/Page'
import {handleChangeSlider} from 'lib/dom'

export interface ProgressBar {
  background: string
  textColor: string
}

export default function GeneralConfig() {
  const {event} = useEvent()

  if (!event.template) {
    return <SelectTemplateForm />
  }

  return (
    <TemplateProvider template={event.template}>
      <Content />
    </TemplateProvider>
  )
}

const MIN_PROGRESS_BAR_THICKNESS = 5
const MAX_PROGRESS_BAR_THICKNESS = 50
const MIN_PROGRESS_BAR_BORDER_RADIUS = 0
const MAX_PROGRESS_BAR_BORDER_RADIUS = 25

function Content() {
  const updateProgressBar = useUpdateObject('progressBar')
  const {progressBar} = useTemplate()

  return (
    <Layout>
      <div>
        <Page>
          <Box>
            <Typography variant="h6">Progress Bar</Typography>
            <ProgressBarPreview
              barColor={progressBar.barColor}
              textColor={progressBar.textColor}
              thickness={progressBar.thickness}
              borderRadius={progressBar.borderRadius}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <ColorPicker
                  label="Bar Color"
                  color={progressBar.barColor}
                  onPick={updateProgressBar('barColor')}
                  aria-label="bar color"
                />
                <Typography variant="subtitle2" style={{opacity: 0.7}}>
                  Thickness
                </Typography>
                <Slider
                  valueLabelDisplay="auto"
                  aria-label="progress bar thickness"
                  value={progressBar.thickness || 0}
                  onChange={handleChangeSlider(updateProgressBar('thickness'))}
                  step={1}
                  min={MIN_PROGRESS_BAR_THICKNESS}
                  max={MAX_PROGRESS_BAR_THICKNESS}
                />
              </Grid>
              <Grid item xs={6}>
                <ColorPicker
                  label="Text Color"
                  color={progressBar.textColor}
                  onPick={updateProgressBar('textColor')}
                  aria-label="text color"
                />
                <Typography variant="subtitle2" style={{opacity: 0.7}}>
                  Border Radius
                </Typography>
                <Slider
                  valueLabelDisplay="auto"
                  aria-label="progress bar border"
                  value={progressBar.borderRadius || 0}
                  onChange={handleChangeSlider(
                    updateProgressBar('borderRadius'),
                  )}
                  step={1}
                  min={MIN_PROGRESS_BAR_BORDER_RADIUS}
                  max={MAX_PROGRESS_BAR_BORDER_RADIUS}
                />
              </Grid>
            </Grid>
          </Box>
          <LoginConfig />
        </Page>
      </div>
    </Layout>
  )
}
