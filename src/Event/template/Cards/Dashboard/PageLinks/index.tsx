import styled from 'styled-components'
import React from 'react'
import {useCards} from 'Event/template/Cards'
import {useToggle} from 'lib/toggle'
import PageLinksConfig from 'Event/template/Cards/Dashboard/PageLinks/PageLinksConfig'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import {eventRoutes} from 'Event/Routes'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useAttendeeVariables} from 'Event'

export default function PageLinks() {
  const {template} = useCards()

  const {
    homeMenuTitle: homeTitle,
    speakers: {menuTitle: speakerTitle, isVisible: showingSpeakers},
    sponsors: {menuTitle: sponsorsTitle, isVisible: showingSponsors},
    zoomBackgrounds: {
      menuTitle: zoomBackgroundsMenuTitle,
      isVisible: showingZoomBackgrounds,
    },
    leaderboard: {menuTitle: pointsTitle, isVisible: showingPoints},
    faq: {menuTitle: faqsTitle, isVisible: showingFaqs},
    pageLinks: {textColor, dividerColor: tabSeparatorColor},
    imageWaterfall: {
      menuTitle: imageWaterfallTitle,
      isVisible: showingImageWaterfall,
    },
  } = template
  const {flag: barConfigVisible, toggle: toggleBarConfig} = useToggle()

  return (
    <>
      <PageLinksConfig isVisible={barConfigVisible} onClose={toggleBarConfig} />
      <Box borderBottomColor={tabSeparatorColor} aria-label="page links">
        <Editable onEdit={toggleBarConfig} aria-label="edit page links">
          <>
            <Link
              showing
              label={homeTitle}
              color={textColor}
              to={eventRoutes.root}
              aria-label="home link"
            />
            <Link
              showing={showingSpeakers}
              label={speakerTitle}
              color={textColor}
              to={eventRoutes.speakers}
              aria-label="speakers link"
            />
            <Link
              color={textColor}
              showing={showingSponsors}
              label={sponsorsTitle}
              to={eventRoutes.sponsors}
              aria-label="sponsors link"
            />
            <Link
              color={textColor}
              showing={showingZoomBackgrounds}
              label={zoomBackgroundsMenuTitle}
              to={eventRoutes.backgrounds}
              aria-label="zoom backgrounds link"
            />
            <Link
              color={textColor}
              showing={showingPoints}
              label={pointsTitle}
              to={eventRoutes.leaderboard}
              aria-label="leaderboard link"
            />
            <Link
              color={textColor}
              showing={showingFaqs}
              label={faqsTitle}
              to={eventRoutes.faq}
              aria-label="faq link"
            />
            <Link
              color={textColor}
              showing={showingImageWaterfall}
              label={imageWaterfallTitle}
              to={eventRoutes.image_waterfall}
              aria-label="faq link"
            />
          </>
        </Editable>
      </Box>
    </>
  )
}

function Link(props: {
  label: string
  showing: boolean
  color: string
  to: string
  'aria-label': string
}) {
  const {label, color, showing} = props
  const v = useAttendeeVariables()
  const isEditMode = useEditMode()
  if (!isEditMode && !showing) {
    return null
  }

  return (
    <StyledRelativeLink
      to={props.to}
      aria-label={props['aria-label']}
      color={color}
    >
      {v(label)}
    </StyledRelativeLink>
  )
}

const DIVIDER_SPACE_PX = 8

const Box = styled.div<{borderBottomColor: string}>`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  text-align: center;
  border-bottom: 2px solid ${(props) => props.borderBottomColor};

  padding-bottom: ${DIVIDER_SPACE_PX}px;

  width: 100%;

  @media (min-width: ${(props) => props.theme.breakpoints.xl}) {
    width: 80%;
  }
`
const StyledRelativeLink = styled(RelativeLink)<{color: string}>`
  color: ${(props) => props.color};
  display: inline-block;
  margin: ${DIVIDER_SPACE_PX}px 25px;
  font-weight: bold;
  font-size: 20px;
`
