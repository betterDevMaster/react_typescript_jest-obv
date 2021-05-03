import {
  useTemplate,
  useUpdateObject,
  useUpdatePrimitive,
} from 'Event/TemplateProvider'
import {onChangeStringHandler, onUnknownChangeHandler} from 'lib/dom'
import {useEvent} from 'Event/EventProvider'
import EventImageUpload from 'organization/Event/DashboardConfig/EventImageUpload'
import ColorPicker from 'lib/ui/ColorPicker'
import React from 'react'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import Grid from '@material-ui/core/Grid'
import Slider from '@material-ui/core/Slider'
import {handleChangeSlider} from 'lib/dom'
import {TextField} from '@material-ui/core'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Box from '@material-ui/core/Box'
import Switch from 'lib/ui/form/Switch'

export type SimpleBlogConfig = {
  type: typeof SIMPLE_BLOG
}

const MIN_HEADER_HEIGHT = 30
const MAX_HEADER_HEIGHT = 200

export function SimpleBlogConfig() {
  const template = useTemplate()
  const {event} = useEvent()

  const updateHeader = useUpdateObject('header')
  const updateMenu = useUpdateObject('menu')
  const updateDashboardBackground = useUpdateObject('dashboardBackground')
  const updateBackgroundPosition = useUpdatePrimitive('backgroundPosition')

  const handleSwitchCollapsed = () => {
    updateHeader('isCollapsed')(!template.header.isCollapsed)
  }

  return (
    <>
      <Box mb={2}>
        <EventImageUpload label="Logo" property="logo" current={event.logo} />
      </Box>
      <Box mb={2}>
        <Grid container>
          <Grid item xs={12} md={6}>
            <Switch
              checked={!template.header.isCollapsed}
              onChange={handleSwitchCollapsed}
              arial-label="config header background image visible switch"
              labelPlacement="start"
              color="primary"
              label="Enable/Disable Header"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DropShawdowToggle />
          </Grid>
        </Grid>
      </Box>
      <Box mb={2}>
        <EventImageUpload
          label="Header Background"
          property="header_background"
          current={event.header_background}
          width={1200}
          height={150}
        />
      </Box>
      <ColorPicker
        label="Header Background Color"
        color={template.header?.backgroundColor}
        onPick={updateHeader('backgroundColor')}
        aria-label="header background color"
      />
      <InputLabel>Header Background Opacity</InputLabel>
      <Slider
        min={0}
        max={1}
        step={0.1}
        onChange={handleChangeSlider(updateHeader('backgroundOpacity'))}
        valueLabelDisplay="auto"
        valueLabelFormat={() => (
          <div>{template.header?.backgroundOpacity * 100}</div>
        )}
        value={template.header?.backgroundOpacity || 0}
        aria-label="background opacity"
      />
      <InputLabel>Header Height</InputLabel>
      <Slider
        min={MIN_HEADER_HEIGHT}
        max={MAX_HEADER_HEIGHT}
        step={1}
        onChange={handleChangeSlider(updateHeader('height'))}
        valueLabelDisplay="auto"
        value={template.header.height}
        aria-label="header height"
      />
      <Box mb={2}>
        <EventImageUpload
          label="Dashboard Background"
          property="dashboard_background"
          current={event.dashboard_background}
          width={1920}
          height={1200}
          canResize
        />
      </Box>
      <ColorPicker
        label="Dashboard Background Color"
        color={template.dashboardBackground?.color}
        onPick={updateDashboardBackground('color')}
        aria-label="dashboard background color"
      />
      <InputLabel>Dashboard Background Color Opacity</InputLabel>
      <Slider
        min={0}
        max={1}
        step={0.1}
        onChange={handleChangeSlider(updateDashboardBackground('opacity'))}
        valueLabelDisplay="auto"
        value={template.dashboardBackground?.opacity || 0}
        valueLabelFormat={() => (
          <div>{(template.dashboardBackground?.opacity || 0) * 100}</div>
        )}
        aria-label="dashboard background color opacity"
      />
      <Box mb={2}>
        <InputLabel>Background Position</InputLabel>
        <Select
          value={template.backgroundPosition}
          onChange={onUnknownChangeHandler(updateBackgroundPosition)}
          fullWidth
        >
          <MenuItem value="fixed">Fixed</MenuItem>
          <MenuItem value="bottom">Bottom</MenuItem>
        </Select>
      </Box>
      <ColorPicker
        label="Menu Background Color"
        color={template.menu?.backgroundColor}
        onPick={updateMenu('backgroundColor')}
        aria-label="menu background color"
      />
      <ColorPicker
        label="Menu Text Color"
        color={template.menu?.textColor}
        onPick={updateMenu('textColor')}
        aria-label="menu text color"
      />
      <ColorPicker
        label="Menu Icon Color"
        color={template.menu?.iconColor}
        onPick={updateMenu('iconColor')}
        aria-label="menu icon color"
      />
      <TextField
        label="Custom Code"
        fullWidth
        variant="outlined"
        name="code"
        inputProps={{
          'aria-label': 'set header custom code',
        }}
        defaultValue={template.header.script || ''}
        onChange={onChangeStringHandler(updateHeader('script'))}
        multiline
        rows={6}
      />
    </>
  )
}

function DropShawdowToggle() {
  const template = useTemplate()
  const updateHeader = useUpdateObject('header')

  const handleSwitchCollapsed = () => {
    updateHeader('disableShadow')(!template.header.disableShadow)
  }

  if (Boolean(template.header.isCollapsed)) return null
  return (
    <Switch
      checked={!template.header.disableShadow}
      onChange={handleSwitchCollapsed}
      arial-label="config header dropShawdowVisible visible switch"
      labelPlacement="start"
      color="primary"
      label={
        template.header.disableShadow ? 'Show Drop-Shadow' : 'Hide Drop-Shadow'
      }
    />
  )
}
