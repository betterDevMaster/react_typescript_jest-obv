import Box from '@material-ui/core/Box'
import InputLabel from '@material-ui/core/InputLabel'
import Slider from '@material-ui/core/Slider'
import {useEvent} from 'Event/EventProvider'
import {usePanels} from 'Event/template/Panels'
import {handleChangeSlider, onChangeCheckedHandler} from 'lib/dom'
import ColorPicker from 'lib/ui/ColorPicker'
import Switch from 'lib/ui/form/Switch'
import EventImageUpload from 'organization/Event/DashboardConfig/EventImageUpload'
import {SectionTitle} from 'organization/Event/GeneralConfig'
import React from 'react'

export default function GlobalStylesConfig() {
  const {template, update} = usePanels()
  const updateBackground = update.object('background')
  const {event} = useEvent()

  return (
    <>
      <SectionTitle>Global Styles</SectionTitle>
      <Box mb={2}>
        <EventImageUpload label="Logo" property="logo" current={event.logo} />
      </Box>
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
    </>
  )
}
