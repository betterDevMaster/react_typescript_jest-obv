import SetPointsButton from 'Event/Dashboard/components/PointsSummary/SetPointsButton'
import {useTemplate} from 'Event/Dashboard/state/TemplateProvider'
import EditComponent from 'Event/Dashboard/editor/views/EditComponent'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import React from 'react'
import styled from 'styled-components'
import {eventRoutes} from 'Event/Routes'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {usePoints} from 'Event/PointsProvider'
import Section from 'Event/template/SimpleBlog/Dashboard/Sidebar/Section'

export type Points = {
  headerImage: string
  description: string
  unit: string
}

export const POINTS_SUMMARY = 'Points Summary'

export default function PointsSummary() {
  const {points: summary} = useTemplate()
  const {score} = usePoints()

  if (!summary) {
    return (
      <EditModeOnly>
        <StyledSetPointsButton />
      </EditModeOnly>
    )
  }

  return (
    <Section>
      <EditComponent component={{type: POINTS_SUMMARY}}>
        <>
          <HeaderImage src={summary.headerImage} alt="Points Image" />
          <NumPointsText aria-label="points summary">
            You've earned {score.points} {summary.unit}!
          </NumPointsText>
          <p>{summary.description}</p>
          <p>
            If you would like to see where you stand on the{' '}
            <RelativeLink to={eventRoutes.leaderboard}>
              <strong>LEADERBOARD you can click HERE!</strong>
            </RelativeLink>
          </p>
        </>
      </EditComponent>
    </Section>
  )
}

const NumPointsText = styled.span`
  font-weight: bold;
  display: block;
  margin-bottom: ${(props) => props.theme.spacing[8]};

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    text-align: center;
  }
`

const HeaderImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  margin-bottom: ${(props) => props.theme.spacing[3]};
`

const StyledSetPointsButton = styled(SetPointsButton)`
  margin-bottom: ${(props) => props.theme.spacing[6]}!important;
`
