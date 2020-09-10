import React from 'react'
import styled from 'styled-components'

export type Points = {
  headerImage: string
  description: string
  unit: string
  numPoints: number
  leaderboardUrl: string
} | null

export default function PointsSummary(props: {
  points: Points
  component?: React.FunctionComponent<any>
}) {
  if (!props.points) {
    return null
  }

  const Component = props.component || 'div'

  return (
    <Component>
      <HeaderImage src={props.points.headerImage} alt={props.points.unit} />
      <NumPointsText>
        You've earned {props.points.numPoints} {props.points.unit}!
      </NumPointsText>
      <p>{props.points.description}</p>
      <p>
        If you would like to see where you stand on the{' '}
        <a href={props.points.leaderboardUrl}>
          <strong>LEADERBOARD you can click HERE!</strong>
        </a>
      </p>
    </Component>
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
