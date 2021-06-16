import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import InputLabel from '@material-ui/core/InputLabel'
import Slider from '@material-ui/core/Slider'
import {useEvent} from 'Event/EventProvider'
import {usePanels} from 'Event/template/Panels'
import {handleChangeSlider, onChangeCheckedHandler} from 'lib/dom'
import {withDefault} from 'lib/template'
import ColorPicker from 'lib/ui/ColorPicker'
import Switch from 'lib/ui/form/Switch'
import EventImageUpload from 'organization/Event/DashboardConfig/EventImageUpload'
import {SectionTitle} from 'organization/Event/GeneralConfig'
import React from 'react'

export const DEFAULT_LINK_UNDERLINE = true

export default function GlobalStylesConfig() {
  const {template, update} = usePanels()
  const updateBackground = update.object('background')
  const {event} = useEvent()

  return (
    <>
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
      <Box mb={2}>
        <Switch
          checked={template.isDarkMode}
          onChange={onChangeCheckedHandler(update.primitive('isDarkMode'))}
          arial-label="set dark mode"
          labelPlacement="end"
          color="primary"
          label="Dark Mode"
        />
      </Box>
      <Box mb={2}>
        <ColorPicker
          label="Accent Color"
          color={template.accentColor}
          onPick={update.primitive('accentColor')}
          aria-label="accent color"
        />
      </Box>
      <Box mb={2}>
        <ColorPicker
          label="Background Color"
          color={template.background?.color}
          onPick={updateBackground('color')}
          aria-label="dashboard background color"
        />
      </Box>
      <InputLabel>Background Color Opacity</InputLabel>
      <Slider
        min={0}
        max={1}
        step={0.1}
        onChange={handleChangeSlider(updateBackground('opacity'))}
        valueLabelDisplay="auto"
        value={template.background?.opacity || 0}
        valueLabelFormat={() => <div>{template.background?.opacity || 0}</div>}
        aria-label="background color opacity"
      />
      <Box mb={2}>
        <ColorPicker
          label="Link Color"
          color={template.linkColor}
          onPick={update.primitive('linkColor')}
          aria-label="link color"
        />
      </Box>
      <Box mb={2}>
        <Switch
          label="Link Underline"
          checked={withDefault(DEFAULT_LINK_UNDERLINE, template.linkUnderline)}
          onChange={onChangeCheckedHandler(update.primitive('linkUnderline'))}
          labelPlacement="end"
          color="primary"
        />
      </Box>
    </>
  )
}
