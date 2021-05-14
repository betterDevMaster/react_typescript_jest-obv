import React from 'react'
import Grid, {GridSize} from '@material-ui/core/Grid'
import {Link} from 'react-router-dom'
import Page from 'Event/template/SimpleBlog/Page'
import styled from 'styled-components'
import {Attendee} from 'Event/attendee'
import {eventRoutes} from 'Event/Routes'
import {Redirect} from 'react-router-dom'
import {useEvent} from 'Event/EventProvider'
import {useTemplate} from 'Event/TemplateProvider'
import {Background, ImagePreviewContainer} from 'organization/Event/Backgrounds/BackgroundsProvider'
import {downloadUrl} from 'lib/dom'
import {useVariables} from 'Event'

const DEFAULT_BACK_TO_DASHBOARD_TEXT = 'Back to Dashboard'
const DEFAULT_BACK_TO_DASHBOARD_TEXT_COLOR = '#000000'

export default function SimpleBlogBackgrounds(props: {user: Attendee}) {
  const v = useVariables()
  const {event} = useEvent()
  const {zoomBackgrounds: settings} = useTemplate()
  const {
    backgrounds,
    zoom_backgrounds_description,
    zoom_backgrounds_title,
  } = event

  const sortedBackgrounds = useSortedBackgrounds(backgrounds)

  if (zoom_backgrounds_title === '' || zoom_backgrounds_description === '') {
    return <Redirect to={eventRoutes.root} />
  }


  const perRow = (12 / (settings.imagesPerRow || 1)) as GridSize

  return (
    <Page user={props.user}>
      <Title>{v(zoom_backgrounds_title || '')}</Title>

      <div
        dangerouslySetInnerHTML={{
          __html: v(zoom_backgrounds_description || ''),
        }}
      />

      <BackToDashboard
        color={v(
          settings?.backToDashboardTextColor ||
            DEFAULT_BACK_TO_DASHBOARD_TEXT_COLOR,
        )}
      >
        <Link to="/">
          {v(settings?.backToDashboardText || DEFAULT_BACK_TO_DASHBOARD_TEXT)}
        </Link>
      </BackToDashboard>

      <Grid container spacing={2}>
        {sortedBackgrounds.map((background) => (
          <Grid item xs={12} md={perRow} key={background.id}>
            <ImagePreviewContainer
              alt=""
              borderRadius={settings.borderRadius}
              borderThickness={settings.borderThickness || 0}
              borderColor={v(settings.borderColor || '#000000')}
              onClick={() =>
                downloadUrl(v(background.image.url), background.image.name)
              }
              src={v(background.image.url)}
              clickable
              width="100%"
            />
          </Grid>
        ))}
      </Grid>
    </Page>
  )
}

const Title = styled.h2`
  font-size: 42px;
  line-height: 1.5;
  text-transform: uppercase;
  text-align: center;
`

const BackToDashboard = styled.div`
  text-align: center;
  margin-bottom: 20px;
  a {
    line-height: 1.5;
    color: ${(props) => props.color};
  }
`

export function useSortedBackgrounds(backgrounds: Background[]) {
  const {zoomBackgrounds: pageSettings} = useTemplate()

  const order = pageSettings?.orderedIds || []

  return backgrounds.sort((a, b) => {
    const aPosition = order.indexOf(a.id)
    const bPosition = order.indexOf(b.id)

    if (aPosition < bPosition) {
      return -1
    }

    if (aPosition > bPosition) {
      return 1
    }

    // Index not found, any order is fine
    return 0
  })
}
