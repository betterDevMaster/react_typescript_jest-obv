import ColorPicker from 'lib/ui/ColorPicker'
import React, {useEffect, useState} from 'react'
import {Cards, useCards} from 'Event/template/Cards'
import Slider from '@material-ui/core/Slider'
import {handleChangeSlider, onChangeStringHandler} from 'lib/dom'
import InputLabel from '@material-ui/core/InputLabel'
import ComponentConfig, {
  ComponentConfigProps,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import {useDispatchUpdate} from 'Event/TemplateProvider'
import TextField from '@material-ui/core/TextField'

const MIN_MAIN_NAV_WIDTH = 10
const MAX_MAIN_NAV_WIDTH = 100

const MIN_MAIN_NAV_BUTTON_HEIGHT = 30
const MAX_MAIN_NAV_BUTTON_HEIGHT = 300

const MIN_MAIN_NAV_BORDER_RADIUS = 0
const MAX_MAIN_NAV_BORDER_RADIUS = 100

export default function MainNavConfig(props: ComponentConfigProps) {
  const {isVisible, onClose} = props
  const {template} = useCards()
  const update = useDispatchUpdate()

  const [mainNavWidth, setMainNavWidth] = useState(template.mainNav.width)
  const [mainNavButtonHeight, setMainNavButtonHeight] = useState(
    template.mainNav.buttonHeight,
  )
  const [mainNavBorderRadius, setMainNavBorderRadius] = useState(
    template.mainNav.borderRadius,
  )

  const [scrollDownText, setScrollDownText] = useState(
    template.mainNav.scrollDownText,
  )

  const [scrollDownArrowColor, setScrollDownArrowColor] = useState(
    template.mainNav.scrollDownArrowColor,
  )

  useEffect(() => {
    if (isVisible) {
      return
    }

    setMainNavWidth(template.mainNav.width)
    setMainNavButtonHeight(template.mainNav.buttonHeight)
    setMainNavBorderRadius(template.mainNav.borderRadius)
    setScrollDownArrowColor(template.mainNav.scrollDownArrowColor)
    setScrollDownText(template.mainNav.scrollDownText)
  }, [isVisible, template])

  const save = () => {
    const data: Cards = {
      ...template,
      mainNav: {
        ...template.mainNav,
        width: mainNavWidth,
        buttonHeight: mainNavButtonHeight,
        borderRadius: mainNavBorderRadius,
        scrollDownText,
        scrollDownArrowColor,
      },
    }

    update(data)
    onClose()
  }

  return (
    <ComponentConfig isVisible={isVisible} onClose={onClose} title="Cards">
      <InputLabel>Main Nav Width</InputLabel>
      <Slider
        min={MIN_MAIN_NAV_WIDTH}
        max={MAX_MAIN_NAV_WIDTH}
        step={1}
        onChange={handleChangeSlider(setMainNavWidth)}
        valueLabelDisplay="auto"
        value={mainNavWidth}
        aria-label="main nav container width"
      />
      <InputLabel>Main Nav Button Height</InputLabel>
      <Slider
        min={MIN_MAIN_NAV_BUTTON_HEIGHT}
        max={MAX_MAIN_NAV_BUTTON_HEIGHT}
        step={1}
        onChange={handleChangeSlider(setMainNavButtonHeight)}
        valueLabelDisplay="auto"
        value={mainNavButtonHeight}
        aria-label="main nav button height"
      />
      <InputLabel>Main Nav Border Radius</InputLabel>
      <Slider
        min={MIN_MAIN_NAV_BORDER_RADIUS}
        max={MAX_MAIN_NAV_BORDER_RADIUS}
        step={1}
        onChange={handleChangeSlider(setMainNavBorderRadius)}
        valueLabelDisplay="auto"
        value={mainNavBorderRadius}
        aria-label="main nav container border radius"
      />
      <TextField
        label="Scroll Down Text"
        value={scrollDownText}
        onChange={onChangeStringHandler(setScrollDownText)}
        inputProps={{
          'aria-label': 'scroll down text',
        }}
        fullWidth
      />
      <ColorPicker
        label="Scroll Down Arrow Color"
        color={scrollDownArrowColor}
        onPick={setScrollDownArrowColor}
        aria-label="scroll down arrow color"
      />

      <SaveButton onClick={save} />
    </ComponentConfig>
  )
}
