import React from 'react'
import Grid, {GridSize} from '@material-ui/core/Grid'
import {Link} from 'react-router-dom'
import Page from 'Event/template/SimpleBlog/Page'
import styled from 'styled-components'
import {Attendee} from 'Event/attendee'
import {useEvent} from 'Event/EventProvider'
import {useAttendeeVariables} from 'Event'
import VisibleOnMatch from 'Event/attendee-rules/VisibleOnMatch'
import {downloadFile} from 'lib/http-client'
import {useSimpleBlogTemplate} from 'Event/template/SimpleBlog'
import Content from 'lib/ui/form/TextEditor/Content'
import BackgroundImage from 'Event/template/SimpleBlog/Backgrounds/BackgroundsConfig/BackgroundImage'
import {useSortBackgrounds} from 'organization/Event/Backgrounds/BackgroundsProvider'
import {PageTitle, PageDescription} from 'Event/template/SimpleBlog/Page'

export default function SimpleBlogBackgrounds(props: {user: Attendee}) {
  const v = useAttendeeVariables()
  const {event} = useEvent()
  const template = useSimpleBlogTemplate()
  const {zoomBackgrounds: settings} = template
  const {
    backgrounds,
    zoom_backgrounds_description,
    zoom_backgrounds_title,
  } = event

  const sortedBackgrounds = useSortBackgrounds(
    settings?.orderedIds,
    backgrounds,
  )

  const perRow = (12 / settings.imagesPerRow) as GridSize

  return (
    <Page user={props.user}>
      <PageTitle>{v(zoom_backgrounds_title || '')}</PageTitle>
      <PageDescription>
        <Content>{v(zoom_backgrounds_description || '')}</Content>
      </PageDescription>

      <BackToDashboard color={v(settings.backToDashboardTextColor)}>
        <Link to="/">{v(settings.backToDashboardText)}</Link>
      </BackToDashboard>

      <Grid container spacing={2}>
        {sortedBackgrounds.map((background) => (
          <VisibleOnMatch
            rules={background.settings?.rules}
            key={background.id}
          >
            <Grid item xs={12} md={perRow}>
              <BackgroundImage
                aria-label="background image"
                alt="background image"
                borderRadius={settings?.borderRadius}
                borderThickness={settings?.borderThickness}
                borderColor={settings?.borderColor}
                onClick={() =>
                  downloadFile(v(background.image.url), background.image.name)
                }
                src={v(background.image.url)}
                clickable
                width="100%"
              />
            </Grid>
          </VisibleOnMatch>
        ))}
      </Grid>
    </Page>
  )
}

const BackToDashboard = styled.div`
  text-align: center;
  margin-bottom: 20px;
  a {
    line-height: 1.5;
    color: ${(props) => props.color};
  }
`
