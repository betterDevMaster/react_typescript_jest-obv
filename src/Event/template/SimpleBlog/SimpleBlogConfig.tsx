import {onChangeCheckedHandler, onUnknownChangeHandler} from 'lib/dom'
import {useEvent} from 'Event/EventProvider'
import EventImageUpload from 'organization/Event/DashboardConfig/EventImageUpload'
import ColorPicker from 'lib/ui/ColorPicker'
import React, {useEffect, useState} from 'react'
import {
  SimpleBlog,
  useSimpleBlogTemplate,
  useSimpleBlogUpdate,
} from 'Event/template/SimpleBlog'
import Grid from '@material-ui/core/Grid'
import Slider from '@material-ui/core/Slider'
import {handleChangeSlider} from 'lib/dom'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Box from '@material-ui/core/Box'
import Switch from 'lib/ui/form/Switch'
import ComponentConfig, {
  ComponentConfigProps,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import {DeepPartial} from 'lib/type-utils'

const MIN_HEADER_HEIGHT = 50
const MAX_HEADER_HEIGHT = 200
const MIN_LOGO_HEIGHT = 30

export function SimpleBlogConfig(props: ComponentConfigProps) {
  const {isVisible, onClose} = props
  const template = useSimpleBlogTemplate()
  const update = useSimpleBlogUpdate()
  const {event} = useEvent()

  const [headerIsCollapsed, setHeaderIsCollapsed] = useState(
    template.header.isCollapsed,
  )
  const [disableHeaderShadow, setDisableHeaderShadow] = useState(
    template.header.disableShadow,
  )
  const [headerBackgroundColor, setHeaderBackgroundColor] = useState(
    template.header.backgroundColor,
  )
  const [headerBackgroundOpacity, setHeaderBackgroundOpacity] = useState(
    template.header.backgroundOpacity,
  )
  const [headerHeight, setHeaderHeight] = useState(template.header.height)
  const [logoHeight, setLogoHeight] = useState(template.header.logoHeight)
  const [dashboardBackgroundColor, setDashboardBackgroundColor] = useState(
    template.dashboardBackground?.color,
  )
  const [dashboardBackgroundOpacity, setDashboardBackgroundOpacity] = useState(
    template.dashboardBackground?.opacity,
  )
  const [backgroundPosition, setBackgroundPosition] = useState(
    template.backgroundPosition,
  )
  const [menuBackgroundColor, setMenuBackgroundColor] = useState(
    template.menu?.backgroundColor,
  )
  const [menuTextColor, setMenuTextColor] = useState(template.menu?.textColor)
  const [menuIconColor, setMenuIconColor] = useState(template.menu?.iconColor)

  useEffect(() => {
    if (isVisible) {
      return
    }

    setHeaderIsCollapsed(template.header.isCollapsed)
    setDisableHeaderShadow(template.header.disableShadow)
    setHeaderBackgroundColor(template.header.backgroundColor)
    setHeaderBackgroundOpacity(template.header.backgroundOpacity)
    setHeaderHeight(template.header.height)
    setLogoHeight(template.header.logoHeight)
    setDashboardBackgroundColor(template.dashboardBackground?.color)
    setDashboardBackgroundOpacity(template.dashboardBackground?.opacity)
    setBackgroundPosition(template.backgroundPosition)
    setMenuBackgroundColor(template.menu?.backgroundColor)
    setMenuTextColor(template.menu?.textColor)
    setMenuIconColor(template.menu?.iconColor)
  }, [isVisible, template])

  const save = () => {
    const data: DeepPartial<SimpleBlog> = {
      header: {
        isCollapsed: headerIsCollapsed,
        disableShadow: disableHeaderShadow,
        backgroundColor: headerBackgroundColor,
        backgroundOpacity: headerBackgroundOpacity,
        height: headerHeight,
        logoHeight: logoHeight,
      },
      dashboardBackground: {
        color: dashboardBackgroundColor || '',
        opacity: dashboardBackgroundOpacity || 0,
      },
      backgroundPosition,
      menu: {
        backgroundColor: menuBackgroundColor,
        textColor: menuTextColor,
        iconColor: menuIconColor,
      },
    }

    update(data)
    onClose()
  }

  return (
    <ComponentConfig
      isVisible={isVisible}
      onClose={onClose}
      title="Simple Blog"
    >
      <Box mb={2}>
        <EventImageUpload label="Logo" property="logo" current={event.logo} />
      </Box>
      <InputLabel>Logo Height</InputLabel>
      <Slider
        min={MIN_LOGO_HEIGHT}
        max={headerHeight}
        step={1}
        onChange={handleChangeSlider(setLogoHeight)}
        valueLabelDisplay="auto"
        value={logoHeight}
        aria-label="logo height"
      />
      <Box mb={2}>
        <Grid container>
          <Grid item xs={12} md={6}>
            <Switch
              checked={headerIsCollapsed}
              onChange={onChangeCheckedHandler(setHeaderIsCollapsed)}
              arial-label="config header background image visible switch"
              labelPlacement="start"
              color="primary"
              label="Hide Header"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DropShadowToggle
              isVisible={!headerIsCollapsed}
              disableShadow={disableHeaderShadow}
              setDisableShadow={setDisableHeaderShadow}
            />
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
        color={headerBackgroundColor}
        onPick={setHeaderBackgroundColor}
        aria-label="header background color"
      />
      <InputLabel>Header Background Opacity</InputLabel>
      <Slider
        min={0}
        max={1}
        step={0.1}
        onChange={handleChangeSlider(setHeaderBackgroundOpacity)}
        valueLabelDisplay="auto"
        valueLabelFormat={() => <div>{headerBackgroundOpacity * 100}</div>}
        value={headerBackgroundOpacity || 0}
        aria-label="background opacity"
      />
      <InputLabel>Header Height</InputLabel>
      <Slider
        min={MIN_HEADER_HEIGHT}
        max={MAX_HEADER_HEIGHT}
        step={1}
        onChange={handleChangeSlider(setHeaderHeight)}
        valueLabelDisplay="auto"
        value={headerHeight}
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
        color={dashboardBackgroundColor}
        onPick={setDashboardBackgroundColor}
        aria-label="dashboard background color"
      />
      <InputLabel>Dashboard Background Color Opacity</InputLabel>
      <Slider
        min={0}
        max={1}
        step={0.1}
        onChange={handleChangeSlider(setDashboardBackgroundOpacity)}
        valueLabelDisplay="auto"
        value={dashboardBackgroundOpacity || 0}
        valueLabelFormat={() => (
          <div>{(dashboardBackgroundOpacity || 0) * 100}</div>
        )}
        aria-label="dashboard background color opacity"
      />
      <Box mb={2}>
        <InputLabel>Background Position</InputLabel>
        <Select
          value={backgroundPosition}
          onChange={onUnknownChangeHandler(setBackgroundPosition)}
          fullWidth
        >
          <MenuItem value="fixed">Fixed</MenuItem>
          <MenuItem value="bottom">Bottom</MenuItem>
        </Select>
      </Box>
      <ColorPicker
        label="Menu Background Color"
        color={menuBackgroundColor}
        onPick={setMenuBackgroundColor}
        aria-label="menu background color"
      />
      <ColorPicker
        label="Menu Text Color"
        color={menuTextColor}
        onPick={setMenuTextColor}
        aria-label="menu text color"
      />
      <ColorPicker
        label="Menu Icon Color"
        color={menuIconColor}
        onPick={setMenuIconColor}
        aria-label="menu icon color"
      />
      <SaveButton onClick={save} />
    </ComponentConfig>
  )
}

function DropShadowToggle(props: {
  isVisible: boolean
  disableShadow?: boolean
  setDisableShadow: (disable: boolean) => void
}) {
  const {disableShadow, setDisableShadow, isVisible} = props

  if (!isVisible) {
    return null
  }

  return (
    <Switch
      checked={disableShadow}
      onChange={onChangeCheckedHandler(setDisableShadow)}
      arial-label="config header dropShawdowVisible visible switch"
      labelPlacement="start"
      color="primary"
      label="Disable Shadow"
    />
  )
}
