import React from 'react'
import Grid, {GridSize} from '@material-ui/core/Grid'
import Page from 'Event/template/SimpleBlog/Page'
import styled from 'styled-components'
import {Attendee} from 'Event/attendee'
import {eventRoutes} from 'Event/Routes'
import {Redirect} from 'react-router-dom'
import {useEvent} from 'Event/EventProvider'
import {useTemplate} from 'Event/TemplateProvider'
import {ImagePreviewContainer} from 'organization/Event/Backgrounds/BackgroundsProvider'
import {downloadUrl} from 'lib/dom'

export default function SimpleBlogBackgrounds(props: {user: Attendee}) {
  const {event} = useEvent()
  const {zoomBackgrounds: settings} = useTemplate()
  const {
    backgrounds,
    zoom_backgrounds_description,
    zoom_backgrounds_title,
  } = event

  if (zoom_backgrounds_title === '' || zoom_backgrounds_description === '') {
    return <Redirect to={eventRoutes.root} />
  }

  const perRow = (12 / (settings.imagesPerRow || 1)) as GridSize

  return (
    <Page user={props.user}>
      <Title>{zoom_backgrounds_title}</Title>

      <Description
        color={settings.description.color}
        dangerouslySetInnerHTML={{__html: zoom_backgrounds_description || ''}}
        fontSize={settings.description.fontSize}
      />

      <Grid container spacing={2}>
        {backgrounds.map((background) => (
          <Grid item xs={12} md={perRow} key={background.id}>
            <ImagePreviewContainer
              alt=""
              borderRadius={settings.borderRadius}
              borderThickness={settings.borderThickness || 0}
              borderColor={settings.borderColor || '#000000'}
              onClick={() =>
                downloadUrl(background.image.url, background.image.name)
              }
              src={background.image.url}
              clickable
              width="100%"
            />
          </Grid>
        ))}
      </Grid>
    </Page>
  )
}

const Description = styled.div<{
  color: string
  fontSize: number
}>`
  color: ${(props) => props.color};
  font-size: ${(props) => props.fontSize}px;
`

const Title = styled.h2`
  font-size: 42px;
  line-height: 1.5;
  text-transform: uppercase;
  text-align: center;
`
