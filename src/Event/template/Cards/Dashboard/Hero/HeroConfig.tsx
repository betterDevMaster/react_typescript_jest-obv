import React from 'react'
import EventImageUpload from 'organization/Event/DashboardConfig/EventImageUpload'
import {useEvent} from 'Event/EventProvider'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import {handleChangeSlider} from 'lib/dom'
import InputLabel from '@material-ui/core/InputLabel'
import Slider from '@material-ui/core/Slider'
import {Cards, useCards} from 'Event/template/Cards'
import ComponentConfig, {
  ComponentConfigProps,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import {Controller, useForm} from 'react-hook-form'
import {useDispatchUpdate} from 'Event/TemplateProvider'
import ColorPicker from 'lib/ui/ColorPicker'

const MIN_HERO_IMAGE_SIZE_PERCENT = 20
const MAX_HERO_IMAGE_SIZE_PERCENT = 100

const MIN_HERO_WELCOME_FONT_SIZE = 5
const MAX_HERO_WELCOME_FONT_SIZE = 50

export type Hero = {
  welcomeText?: string
  welcomeFontSize?: number
  welcomeTextColor?: string
  heroImageSize?: number
}

export function HeroConfig(props: ComponentConfigProps) {
  const {isVisible, onClose} = props
  const {event} = useEvent()
  const {template} = useCards()

  const update = useDispatchUpdate()

  const {
    hero: {welcomeText, heroImageSize, welcomeTextColor, welcomeFontSize},
  } = template

  const {register, handleSubmit, control} = useForm()

  const save = ({
    heroImageSize,
    welcomeText,
    welcomeTextColor,
    welcomeFontSize,
  }: Hero) => {
    const data: Cards = {
      ...template,
      hero: {
        ...template.hero,
        welcomeText,
        heroImageSize,
        welcomeTextColor,
        welcomeFontSize,
      },
    }

    update(data)
    onClose()
  }

  return (
    <ComponentConfig title="Hero" isVisible={isVisible} onClose={onClose}>
      <form onSubmit={handleSubmit(save)}>
        <Box mb={2}>
          <EventImageUpload
            label="Image"
            property="welcome_image"
            current={event.welcome_image}
          />
        </Box>
        <InputLabel>Image Size</InputLabel>
        <Controller
          control={control}
          name="heroImageSize"
          defaultValue={heroImageSize}
          render={({value, onChange}) => (
            <Slider
              min={MIN_HERO_IMAGE_SIZE_PERCENT}
              max={MAX_HERO_IMAGE_SIZE_PERCENT}
              step={1}
              onChange={handleChangeSlider(onChange)}
              valueLabelDisplay="auto"
              value={value}
              aria-label="hero image size"
            />
          )}
        />
        <Box display="flex" justifyContent="center">
          <TextField
            fullWidth
            name="welcomeText"
            defaultValue={welcomeText || ''}
            placeholder="Text"
            inputProps={{
              'aria-label': 'dashboard welcome text',
              ref: register,
            }}
          />
        </Box>
        <Controller
          name="welcomeTextColor"
          defaultValue={welcomeTextColor}
          control={control}
          render={({value, onChange}) => (
            <ColorPicker
              label="Hero Text Color"
              color={value}
              onPick={onChange}
              aria-label="hero text color"
            />
          )}
        />
        <InputLabel>Hero Text Font Size</InputLabel>
        <Controller
          control={control}
          name="welcomeFontSize"
          defaultValue={welcomeFontSize}
          render={({value, onChange}) => (
            <Slider
              min={MIN_HERO_WELCOME_FONT_SIZE}
              max={MAX_HERO_WELCOME_FONT_SIZE}
              step={1}
              onChange={handleChangeSlider(onChange)}
              valueLabelDisplay="auto"
              value={value}
              aria-label="welcome text font size"
            />
          )}
        />
        <SaveButton type="submit" />
      </form>
    </ComponentConfig>
  )
}
