import {
  useTemplate,
  useUpdateTemplate,
} from 'Event/Dashboard/state/TemplateProvider'
import {useEvent} from 'Event/EventProvider'
import {HEADER} from 'Event/template/SimpleBlog/Dashboard/Header'
import EventImageUpload from 'organization/Event/DashboardConfig/EventImageUpload'
import ColorPicker from 'lib/ui/ColorPicker'
import React from 'react'
import {SimpleBlog} from 'Event/template/SimpleBlog'
import Grid from '@material-ui/core/Grid'
import Slider from '@material-ui/core/Slider'
import {handleChangeSlider} from 'lib/dom'
import InputLabel from '@material-ui/core/InputLabel'

export type HeaderConfig = {
  type: typeof HEADER
}

const MIN_HEADER_HEIGHT = 10
const MAX_HEADER_HEIGHT = 200

export function HeaderConfig() {
  const template = useTemplate()
  const {header} = template
  const updateTemplate = useUpdateTemplate()
  const {event} = useEvent()

  const updatePrimary = <T extends keyof SimpleBlog>(key: T) => (
    value: SimpleBlog[T],
  ) => {
    updateTemplate({
      [key]: value,
    })
  }
  const update = <T extends keyof SimpleBlog['header']>(key: T) => (
    value: SimpleBlog['header'][T],
  ) =>
    updateTemplate({
      header: {
        ...header,
        [key]: value,
      },
    })

  return (
    <>
      <Grid container item justify="center" spacing={3} xs={12}>
        <Grid item xs={6}>
          <EventImageUpload
            label="Logo"
            property="logo"
            current={event.logo?.url}
          />
        </Grid>
        <Grid item xs={6}>
          <EventImageUpload
            label="Header Background"
            property="header_background"
            current={event.header_background?.url}
          />
        </Grid>
      </Grid>
      <Grid container item justify="center" spacing={3} xs={12}>
        <Grid item xs={6}>
          <ColorPicker
            label="Primary Color"
            color={template.primaryColor}
            onPick={updatePrimary('primaryColor')}
            aria-label="primary color"
          />
        </Grid>
        <Grid item xs={6}>
          <ColorPicker
            label="Header Background Color"
            color={template.header?.backgroundColor}
            onPick={update('backgroundColor')}
            aria-label="header background color"
          />
        </Grid>
      </Grid>
      <InputLabel>Background Opacity</InputLabel>
      <Slider
        min={0}
        max={1}
        step={0.05}
        onChange={handleChangeSlider(update('backgroundOpacity'))}
        valueLabelDisplay="auto"
        value={template.header?.backgroundOpacity || 1}
        aria-label="background opacity"
      />
      <InputLabel>Header Height</InputLabel>
      <Slider
        min={MIN_HEADER_HEIGHT}
        max={MAX_HEADER_HEIGHT}
        step={1}
        onChange={handleChangeSlider(update('height'))}
        valueLabelDisplay="auto"
        value={template.header.height}
        aria-label="header height"
      />
    </>
  )
}
