import {useTemplate, useUpdateObject} from 'Event/TemplateProvider'
import {SIDEBAR_CONTAINER} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarContainer'
import ColorPicker from 'lib/ui/ColorPicker'
import React from 'react'
import InputLabel from '@material-ui/core/InputLabel'
import Slider from '@material-ui/core/Slider'
import {handleChangeSlider, onChangeCheckedHandler} from 'lib/dom'
import EventImageUpload from 'organization/Event/DashboardConfig/EventImageUpload'
import {useEvent} from 'Event/EventProvider'
import Switch from 'lib/ui/form/Switch'
import Box from '@material-ui/core/Box'

export type SidebarContainerConfig = {
  type: typeof SIDEBAR_CONTAINER
}

const MIN_SIDEBAR_PADDING_TOP = 0
const MAX_SIDEBAR_PADDING_TOP = 720

const MIN_SIDEBAR_BORDER_WIDTH = 0
const MAX_SIDEBAR_BORDER_WIDTH = 50

const MIN_SIDEBAR_BORDER_RADIUS = 0
const MAX_SIDEBAR_BORDER_RADIUS = 25

export function SidebarContainerConfig() {
  const {sidebar} = useTemplate()
  const updateSideBar = useUpdateObject('sidebar')
  const {event} = useEvent()

  return (
    <>
      <Box display="flex" justifyContent="flex-end">
        <Switch
          checked={sidebar.isVisible}
          onChange={onChangeCheckedHandler(updateSideBar('isVisible'))}
          arial-label="config visible switch"
          labelPlacement="start"
          color="primary"
          label={sidebar.isVisible ? 'Enabled' : 'Disabled'}
        />
      </Box>
      <EventImageUpload
        label="Background Image"
        property="sidebar_background"
        current={event.sidebar_background?.url}
      />
      <InputLabel>Top Padding</InputLabel>
      <Slider
        min={MIN_SIDEBAR_PADDING_TOP}
        max={MAX_SIDEBAR_PADDING_TOP}
        step={4}
        onChange={handleChangeSlider(updateSideBar('paddingTop'))}
        valueLabelDisplay="auto"
        value={sidebar.paddingTop || 48}
        aria-label="padding top"
      />
      <ColorPicker
        label="Background Color"
        color={sidebar.background}
        onPick={updateSideBar('background')}
        aria-label="background color"
      />
      <ColorPicker
        label="Text Color"
        color={sidebar.textColor}
        onPick={updateSideBar('textColor')}
        aria-label="color"
      />
      <InputLabel>Border Thickness</InputLabel>
      <Slider
        min={MIN_SIDEBAR_BORDER_WIDTH}
        max={MAX_SIDEBAR_BORDER_WIDTH}
        step={1}
        onChange={handleChangeSlider(updateSideBar('borderWidth'))}
        valueLabelDisplay="auto"
        value={sidebar.borderWidth}
        aria-label="border thickness"
      />
      <ColorPicker
        label="Border Color"
        color={sidebar.borderColor}
        onPick={updateSideBar('borderColor')}
      />
      <InputLabel>Border Radius</InputLabel>
      <Slider
        min={MIN_SIDEBAR_BORDER_RADIUS}
        max={MAX_SIDEBAR_BORDER_RADIUS}
        step={1}
        onChange={handleChangeSlider(updateSideBar('borderRadius'))}
        valueLabelDisplay="auto"
        value={sidebar.borderRadius}
        aria-label="border radius"
      />
    </>
  )
}
