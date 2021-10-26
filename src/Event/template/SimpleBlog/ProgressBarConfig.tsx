import React from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Slider from '@material-ui/core/Slider'
import ColorPicker from 'lib/ui/ColorPicker'
import {handleChangeSlider, onChangeCheckedHandler} from 'lib/dom'
import {useSimpleBlog} from 'Event/template/SimpleBlog'
import {SectionTitle} from 'organization/Event/Page'
import Switch from 'lib/ui/form/Switch'
import Layout from 'organization/user/Layout'
import Page from 'organization/Event/Page'
import ProgressBar, {ProgressBarProps} from 'lib/ui/ProgressBar'

export interface ProgressBar {
  background: string
  textColor: string
}

const MIN_PROGRESS_BAR_THICKNESS = 5
const MAX_PROGRESS_BAR_THICKNESS = 50
const MIN_PROGRESS_BAR_BORDER_RADIUS = 0
const MAX_PROGRESS_BAR_BORDER_RADIUS = 25

export default function ProgressBarConfig() {
  const {
    update,
    template: {progressBar},
  } = useSimpleBlog()
  const updateProgressBar = update.object('progressBar')

  return (
    <Layout>
      <Page>
        <SectionTitle>Progress Bar</SectionTitle>
        <ProgressBarPreview
          showing={progressBar.showing}
          barColor={progressBar.barColor}
          textColor={progressBar.textColor}
          thickness={progressBar.thickness}
          borderRadius={progressBar.borderRadius}
        />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Switch
              label="Show"
              checked={progressBar.showing}
              onChange={onChangeCheckedHandler(updateProgressBar('showing'))}
              labelPlacement="end"
              color="primary"
              aria-label="progress bar visible"
            />
          </Grid>
          <Config />
        </Grid>
      </Page>
    </Layout>
  )
}

function Config() {
  const {
    update,
    template: {progressBar},
  } = useSimpleBlog()

  const updateProgressBar = update.object('progressBar')

  if (!progressBar.showing) {
    return null
  }

  return (
    <>
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
          onChange={handleChangeSlider(updateProgressBar('borderRadius'))}
          step={1}
          min={MIN_PROGRESS_BAR_BORDER_RADIUS}
          max={MAX_PROGRESS_BAR_BORDER_RADIUS}
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
