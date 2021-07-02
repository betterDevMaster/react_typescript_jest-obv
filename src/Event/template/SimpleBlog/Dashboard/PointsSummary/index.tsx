import SetPointsButton from 'Event/template/SimpleBlog/Dashboard/PointsSummary/SetPointsButton'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import React from 'react'
import styled from 'styled-components'
import {eventRoutes} from 'Event/Routes'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {usePoints} from 'Event/PointsProvider'
import Section from 'Event/template/SimpleBlog/Dashboard/Sidebar/Section'
import {usePlatformActions} from 'Event/ActionsProvider/platform-actions'
import {useEvent} from 'Event/EventProvider'
import {useVariables} from 'Event'
import {useSimpleBlog} from 'Event/template/SimpleBlog'
import {useToggle} from 'lib/toggle'
import {PointsSummaryConfig} from 'Event/template/SimpleBlog/Dashboard/PointsSummary/PointsSummaryConfig'

export type Points = {
  description: string
  unit: string
}

export default function PointsSummary() {
  const {template} = useSimpleBlog()
  const {points: summary, sidebar} = template
  const {visitLeaderboard: VISIT_LEADERBOARD} = usePlatformActions()
  const {score, submit} = usePoints()
  const {event} = useEvent()
  const logo = event.points_summary_logo ? event.points_summary_logo.url : ''
  const v = useVariables()
  const awardPoints = () => {
    submit(VISIT_LEADERBOARD)
  }
  const {flag: configVisible, toggle: toggleConfig} = useToggle()

  if (!summary) {
    return (
      <EditModeOnly>
        <PointsSummaryConfig isVisible={configVisible} onClose={toggleConfig} />
        <StyledSetPointsButton onClick={toggleConfig} />
      </EditModeOnly>
    )
  }

  return (
    <>
      <PointsSummaryConfig isVisible={configVisible} onClose={toggleConfig} />
      <Section>
        <Editable onEdit={toggleConfig}>
          <>
            <HeaderImage src={logo} alt="Points Image" />
            <Box color={sidebar.textColor}>
              <NumPointsText aria-label="points summary">
                You've earned {score.points} {summary.unit}!
              </NumPointsText>
              <p>{v(summary.description)}</p>
              <p>
                If you would like to see where you stand on the{' '}
                <StyledLink
                  color={sidebar.textColor}
                  to={eventRoutes.leaderboard}
                  aria-label="view leaderboard"
                  onClick={awardPoints}
                >
                  <strong>LEADERBOARD you can click HERE!</strong>
                </StyledLink>
              </p>
            </Box>
          </>
        </Editable>
      </Section>
    </>
  )
}

const Box = styled.div<{color: string}>`
  color: ${(props) => props.color};
`

const StyledLink = styled(RelativeLink)<{color: string}>`
  color: ${(props) => props.color}!important;
`

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
