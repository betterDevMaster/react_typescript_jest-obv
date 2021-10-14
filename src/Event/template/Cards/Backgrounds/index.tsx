import React from 'react'
import Grid, {GridSize} from '@material-ui/core/Grid'
import {useEvent} from 'Event/EventProvider'
import {useAttendeeVariables} from 'Event'
import VisibleOnMatch from 'Event/attendee-rules/VisibleOnMatch'
import {downloadFile} from 'lib/http-client'
import {useCards} from 'Event/template/Cards'
import Content from 'lib/ui/form/TextEditor/Content'
import BackgroundImage from 'Event/template/Cards/Backgrounds/BackgroundsConfig/BackgroundImage'
import {useSortBackgrounds} from 'organization/Event/Backgrounds/BackgroundsProvider'
import {PageDescription, PageTitle} from 'Event/template/Cards/Page'
import CardsPage from 'Event/template/Cards/Page'
import {User} from 'auth/user'

export default function CardsBackgrounds(props: {user: User}) {
  const v = useAttendeeVariables()
  const {event} = useEvent()
  const {template} = useCards()
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
    <CardsPage user={props.user}>
      <PageTitle>{v(zoom_backgrounds_title || '')}</PageTitle>
      <PageDescription>
        <Content>{v(zoom_backgrounds_description || '')}</Content>
      </PageDescription>
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
    </CardsPage>
  )
}
