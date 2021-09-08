import React from 'react'
import Grid from '@material-ui/core/Grid'
import styled from 'styled-components'
import {useEvent} from 'Event/EventProvider'
import {useAttendeeVariables} from 'Event'
import VisibleOnMatch from 'Event/attendee-rules/VisibleOnMatch'
import {downloadFile} from 'lib/http-client'
import {usePanels} from 'Event/template/Panels'
import Content from 'lib/ui/form/TextEditor/Content'
import BackgroundImage from 'Event/template/Panels/Dashboard/Resources/Backgrounds/BackgroundsConfig/BackgroundImage'
import {useSortBackgrounds} from 'organization/Event/Backgrounds/BackgroundsProvider'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'

export default function PanelsBackgrounds() {
  const v = useAttendeeVariables()
  const {event} = useEvent()
  const {template} = usePanels()
  const {zoomBackgrounds: settings} = template
  const {resourceList: list} = template

  const {
    backgrounds,
    zoom_backgrounds_description,
    zoom_backgrounds_title,
  } = event

  const sortedBackgrounds = useSortBackgrounds(
    settings?.orderedIds,
    backgrounds,
  )

  const hasBackgrounds = backgrounds.length > 0
  if (!hasBackgrounds) {
    return null
  }

  return (
    <StyledCard
      variant="outlined"
      backgroundColor={list.cardBackgroundColor}
      borderRadius={10}
    >
      <CardContent>
        <Title>{v(zoom_backgrounds_title || '')}</Title>
        <Content>{v(zoom_backgrounds_description || '')}</Content>
      </CardContent>
      <CardActions>
        <Grid container spacing={2}>
          {sortedBackgrounds.map((background) => (
            <VisibleOnMatch
              rules={background.settings?.rules}
              key={background.id}
            >
              <Grid item xs={12} sm={4}>
                <BackgroundImage
                  aria-label="background image"
                  alt="background image"
                  borderRadius={settings.borderRadius}
                  borderThickness={settings.borderThickness}
                  borderColor={settings.borderColor}
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
      </CardActions>
    </StyledCard>
  )
}

const StyledCard = styled((props) => {
  const {backgroundColor, borderRadius, ...otherProps} = props
  return <Card {...otherProps} />
})`
  background-color: ${(props) => props.backgroundColor} !important;
  border-radius: ${(props) => props.borderRadius}px !important;
  margin-bottom: 15px;
  opacity: 0.8;
  &:hover {
    opacity: 1;
  }
`

const Title = styled.h2`
  font-size: 29px;
  line-height: 1.5;
  margin: 0;
`
