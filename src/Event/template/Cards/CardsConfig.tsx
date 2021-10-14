import {onChangeCheckedHandler} from 'lib/dom'
import ColorPicker from 'lib/ui/ColorPicker'
import React, {useEffect, useState} from 'react'
import {Cards, useCards} from 'Event/template/Cards'
import Grid from '@material-ui/core/Grid'
import Slider from '@material-ui/core/Slider'
import {handleChangeSlider, onUnknownChangeHandler} from 'lib/dom'
import InputLabel from '@material-ui/core/InputLabel'
import Box from '@material-ui/core/Box'
import Switch from 'lib/ui/form/Switch'
import ComponentConfig, {
  ComponentConfigProps,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import {useDispatchUpdate} from 'Event/TemplateProvider'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import EventImageUpload from 'organization/Event/DashboardConfig/EventImageUpload'
import {useEvent} from 'Event/EventProvider'

const MIN_LOGO_SIZE = 1
const MAX_LOGO_SIZE = 100

export function CardsConfig(props: ComponentConfigProps) {
  const {isVisible, onClose} = props
  const {template} = useCards()
  const {event} = useEvent()

  const update = useDispatchUpdate()

  const [headerIsCollapsed, setHeaderIsCollapsed] = useState(
    template.header.isCollapsed,
  )

  const [headerBackgroundColor, setHeaderBackgroundColor] = useState(
    template.header.backgroundColor,
  )
  const [headerBackgroundOpacity, setHeaderBackgroundOpacity] = useState(
    template.header.backgroundOpacity,
  )
  const [logoSize, setLogoSize] = useState(template.header.logoSize)
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
    setHeaderBackgroundColor(template.header.backgroundColor)
    setHeaderBackgroundOpacity(template.header.backgroundOpacity)
    setLogoSize(template.header.logoSize)
    setMenuBackgroundColor(template.menu?.backgroundColor)
    setMenuTextColor(template.menu?.textColor)
    setMenuIconColor(template.menu?.iconColor)
    setBackgroundPosition(template.backgroundPosition)
  }, [isVisible, template])

  const save = () => {
    const data: Cards = {
      ...template,
      header: {
        isCollapsed: headerIsCollapsed,
        backgroundColor: headerBackgroundColor,
        backgroundOpacity: headerBackgroundOpacity,
        logoSize: logoSize,
      },
      menu: {
        backgroundColor: menuBackgroundColor,
        textColor: menuTextColor,
        iconColor: menuIconColor,
      },
      backgroundPosition,
    }

    update(data)
    onClose()
  }

  return (
    <ComponentConfig isVisible={isVisible} onClose={onClose} title="Cards">
      <Box mb={2}>
        <Grid container>
          <Grid item xs={12} md={6}>
            <Box mb={2}>
              <EventImageUpload
                label="Logo"
                property="logo"
                current={event.logo}
              />
            </Box>
          </Grid>
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
        </Grid>
      </Box>
      <InputLabel>Logo Size</InputLabel>
      <Slider
        min={MIN_LOGO_SIZE}
        max={MAX_LOGO_SIZE}
        step={1}
        onChange={handleChangeSlider(setLogoSize)}
        valueLabelDisplay="auto"
        value={logoSize}
        aria-label="header logo size"
      />
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
      <InputLabel>Background Position</InputLabel>
      <Select
        value={backgroundPosition}
        onChange={onUnknownChangeHandler(setBackgroundPosition)}
        fullWidth
      >
        <MenuItem value="fixed">Fixed</MenuItem>
        <MenuItem value="bottom">Bottom</MenuItem>
      </Select>
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
