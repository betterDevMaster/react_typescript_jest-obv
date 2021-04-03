import {HERO} from 'Event/template/SimpleBlog/Dashboard/Hero'
import React from 'react'
import EventImageUpload from 'organization/Event/DashboardConfig/EventImageUpload'
import {useEvent} from 'Event/EventProvider'
import Box from '@material-ui/core/Box'
import {TextField} from '@material-ui/core'
import {onChangeStringHandler} from 'lib/dom'
import {useTemplate, useUpdatePrimitive} from 'Event/TemplateProvider'

export type HeroConfig = {
  type: typeof HERO
}

export function HeroConfig() {
  const {event} = useEvent()
  const updateWelcomeText = useUpdatePrimitive('welcomeText')
  const {welcomeText} = useTemplate()

  return (
    <>
      <Box mb={2}>
        <EventImageUpload
          label="Image"
          property="welcome_image"
          current={event.welcome_image?.url}
        />
      </Box>
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
