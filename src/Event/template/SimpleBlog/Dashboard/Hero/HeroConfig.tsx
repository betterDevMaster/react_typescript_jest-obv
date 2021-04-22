import {HERO} from 'Event/template/SimpleBlog/Dashboard/Hero'
import React from 'react'
import EventImageUpload from 'organization/Event/DashboardConfig/EventImageUpload'
import {useEvent} from 'Event/EventProvider'
import Box from '@material-ui/core/Box'
import {TextField} from '@material-ui/core'
import {handleChangeSlider, onChangeStringHandler} from 'lib/dom'
import {useTemplate, useUpdatePrimitive} from 'Event/TemplateProvider'
import InputLabel from '@material-ui/core/InputLabel'
import Slider from '@material-ui/core/Slider'

export const DEFAULT_HERO_IMAGE_SIZE_PERCENT = 50
const MIN_HERO_IMAGE_SIZE_PERCENT = 20
const MAX_HERO_IMAGE_SIZE_PERCENT = 100

export type HeroConfig = {
  type: typeof HERO
}

export function HeroConfig() {
  const {event} = useEvent()
  const updateWelcomeText = useUpdatePrimitive('welcomeText')
  const updateHeroImageSize = useUpdatePrimitive('heroImageSize')
  const {welcomeText, heroImageSize} = useTemplate()

  return (
    <>
      <Box mb={2}>
        <EventImageUpload
          label="Image"
          property="welcome_image"
          current={event.welcome_image?.url}
        />
      </Box>
      <InputLabel>Image Size</InputLabel>
      <Slider
        min={MIN_HERO_IMAGE_SIZE_PERCENT}
        max={MAX_HERO_IMAGE_SIZE_PERCENT}
        step={1}
        onChange={handleChangeSlider(updateHeroImageSize)}
        valueLabelDisplay="auto"
        value={heroImageSize || DEFAULT_HERO_IMAGE_SIZE_PERCENT}
        aria-label="hero image size"
      />
      <Box display="flex" justifyContent="center">
        <TextField
          fullWidth
          placeholder="Text"
          inputProps={{
            'aria-label': 'dashboard welcome text',
          }}
          value={welcomeText || ''}
          onChange={onChangeStringHandler(updateWelcomeText)}
        />
      </Box>
    </>
  )
}
