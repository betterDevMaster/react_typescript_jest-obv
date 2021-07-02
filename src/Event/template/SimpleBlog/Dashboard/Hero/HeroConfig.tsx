import React from 'react'
import EventImageUpload from 'organization/Event/DashboardConfig/EventImageUpload'
import {useEvent} from 'Event/EventProvider'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import {handleChangeSlider} from 'lib/dom'
import InputLabel from '@material-ui/core/InputLabel'
import Slider from '@material-ui/core/Slider'
import {SimpleBlog, useSimpleBlog} from 'Event/template/SimpleBlog'
import ComponentConfig, {
  ComponentConfigProps,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import {Controller, useForm} from 'react-hook-form'
import {useDispatchUpdate} from 'Event/TemplateProvider'

export const DEFAULT_HERO_IMAGE_SIZE_PERCENT = 50
const MIN_HERO_IMAGE_SIZE_PERCENT = 20
const MAX_HERO_IMAGE_SIZE_PERCENT = 100

export function HeroConfig(props: ComponentConfigProps) {
  const {isVisible, onClose} = props
  const {event} = useEvent()
  const {template} = useSimpleBlog()

  const update = useDispatchUpdate()

  const {welcomeText, heroImageSize} = template

  const {register, handleSubmit, control} = useForm()

  const save = ({heroImageSize, welcomeText}: any) => {
    const data: SimpleBlog = {
      ...template,
      welcomeText,
      heroImageSize,
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
          defaultValue={heroImageSize || DEFAULT_HERO_IMAGE_SIZE_PERCENT}
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
        <SaveButton type="submit" />
      </form>
    </ComponentConfig>
  )
}
