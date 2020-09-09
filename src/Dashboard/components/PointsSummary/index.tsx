import React from 'react'
import styled from 'styled-components'

export type Points = {
  headerImage: string
  description: string
  unit: string
  numPoints: number
  leaderboardUrl: string
} | null

export default function PointsSummary(props: {points: Points}) {
  if (!props.points) {
    return null
  }

  return (
    <div>
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
    </div>
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
  text-align: center;
`
