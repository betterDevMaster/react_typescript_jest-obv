import ColorPicker from 'lib/ui/ColorPicker'
import React from 'react'
import {Cards, useCardsTemplate, useCardsUpdate} from 'Event/template/Cards'
import Slider from '@material-ui/core/Slider'
import {handleChangeSlider} from 'lib/dom'
import InputLabel from '@material-ui/core/InputLabel'
import ComponentConfig, {
  ComponentConfigProps,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import TextField from '@material-ui/core/TextField'
import {Controller, useForm} from 'react-hook-form'

const MIN_MAIN_NAV_WIDTH = 10
const MAX_MAIN_NAV_WIDTH = 100

const MIN_MAIN_NAV_BUTTON_HEIGHT = 30
const MAX_MAIN_NAV_BUTTON_HEIGHT = 300

const MIN_MAIN_NAV_BORDER_RADIUS = 0
const MAX_MAIN_NAV_BORDER_RADIUS = 100

export default function MainNavConfig(props: ComponentConfigProps) {
  const {isVisible, onClose} = props
  const {mainNav} = useCardsTemplate()
  const update = useCardsUpdate()
  const {handleSubmit, register, control} = useForm()

  const save = (data: Omit<Cards['mainNav'], 'buttons'>) => {
    update({
      mainNav: data,
    })
    onClose()
  }

  return (
    <ComponentConfig isVisible={isVisible} onClose={onClose} title="Cards">
      <form onSubmit={handleSubmit(save)}>
        <InputLabel>Main Nav Width</InputLabel>
        <Controller
          name="width"
          defaultValue={mainNav.width}
          control={control}
          render={({value, onChange}) => (
            <Slider
              min={MIN_MAIN_NAV_WIDTH}
              max={MAX_MAIN_NAV_WIDTH}
              step={1}
              onChange={handleChangeSlider(onChange)}
              valueLabelDisplay="auto"
              value={value}
              aria-label="main nav container width"
            />
          )}
        />
        <InputLabel>Main Nav Button Height</InputLabel>
        <Controller
          name="buttonHeight"
          defaultValue={mainNav.buttonHeight}
          control={control}
          render={({value, onChange}) => (
            <Slider
              min={MIN_MAIN_NAV_BUTTON_HEIGHT}
              max={MAX_MAIN_NAV_BUTTON_HEIGHT}
              step={1}
              onChange={handleChangeSlider(onChange)}
              valueLabelDisplay="auto"
              value={value}
              aria-label="main nav button height"
            />
          )}
        />
        <InputLabel>Main Nav Border Radius</InputLabel>
        <Controller
          name="borderRadius"
          defaultValue={mainNav.borderRadius}
          control={control}
          render={({value, onChange}) => (
            <Slider
              min={MIN_MAIN_NAV_BORDER_RADIUS}
              max={MAX_MAIN_NAV_BORDER_RADIUS}
              step={1}
              onChange={handleChangeSlider(onChange)}
              valueLabelDisplay="auto"
              value={value}
              aria-label="main nav container border radius"
            />
          )}
        />
        <TextField
          label="Scroll Down Text"
          name="scrollDownText"
          defaultValue={mainNav.scrollDownText}
          inputProps={{
            'aria-label': 'scroll down text',
            ref: register,
          }}
          fullWidth
        />
        <Controller
          name="scrollDownArrowColor"
          defaultValue={mainNav.scrollDownArrowColor}
          control={control}
          render={({value, onChange}) => (
            <ColorPicker
              label="Scroll Down Arrow Color"
              color={value}
              onPick={onChange}
              aria-label="scroll down arrow color"
            />
          )}
        />
        <SaveButton />
      </form>
    </ComponentConfig>
  )
}
