import SetPointsButton from 'Dashboard/components/PointsSummary/SetPointsButton'
import {useCurrent} from 'Dashboard/edit/state/edit-mode'
import EditComponent from 'Dashboard/edit/views/EditComponent'
import EditModeOnly from 'Dashboard/edit/views/EditModeOnly'
import React from 'react'
import styled from 'styled-components'

export type Points = {
  headerImage: string
  description: string
  unit: string
  numPoints: number
  leaderboardUrl: string
}

export const POINTS_SUMMARY = 'Points Summary'

export default function PointsSummary(props: {
  points: Points | null
  component?: React.FunctionComponent<any>
}) {
  const points = useCurrent(
    (state) => state.dashboardEditor.points,
    props.points,
  )

  if (!points) {
    return (
      <EditModeOnly>
        <StyledSetPointsButton />
      </EditModeOnly>
    )
  }

  const Component = props.component || 'div'

  return (
    <EditComponent type={POINTS_SUMMARY}>
      <Component>
        <HeaderImage
          src={points.headerImage}
          alt={points.unit}
          aria-label="points summary"
        />
        <NumPointsText>
          You've earned {points.numPoints} {points.unit}!
        </NumPointsText>
        <p>{points.description}</p>
        <p>
          If you would like to see where you stand on the{' '}
          <a href={points.leaderboardUrl}>
            <strong>LEADERBOARD you can click HERE!</strong>
          </a>
        </p>
      </Component>
    </EditComponent>
  )
}

const HeaderImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  margin-bottom: ${(props) => props.theme.spacing[3]};
`

const NumPointsText = styled.span`
  font-weight: bold;
  display: block;
  margin-bottom: ${(props) => props.theme.spacing[8]};

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    text-align: center;
  }
`

const StyledSetPointsButton = styled(SetPointsButton)`
  margin-bottom: ${(props) => props.theme.spacing[6]}!important;
`
