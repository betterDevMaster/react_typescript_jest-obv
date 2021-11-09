import React from 'react'
import LinearProgress, {
  LinearProgressProps,
} from '@material-ui/core/LinearProgress'
import Typography, {TypographyProps} from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import styled from 'styled-components'
import Container from '@material-ui/core/Container'

export interface ProgressBarStyleProps {
  barColor?: string
  backgroundColor?: string
  textColor?: string
  thickness?: number
  borderRadius?: number
}

export type ProgressBarProps = {
  value: number
  showing: boolean
} & ProgressBarStyleProps

export default function ProgressBar(
  props: LinearProgressProps & ProgressBarProps,
) {
  if (!props.showing) {
    return null
  }

  return (
    <Container maxWidth="sm">
      <Box display="flex" alignItems="center" mb={3}>
        <BarContainer backgroundColor={props.backgroundColor}>
          <StyledLinearProgress variant="determinate" {...props} />
        </BarContainer>
        <Box minWidth={35}>
          <StyledTypography
            variant="body2"
            textColor={props.textColor}
          >{`${Math.round(props.value)}%`}</StyledTypography>
        </Box>
      </Box>
    </Container>
  )
}

const BarContainer = styled.div<{
  backgroundColor: string | undefined
}>`
  width: 100% !important;
  margin-right: ${(props) => props.theme.spacing[2]} !important;
`

const StyledLinearProgress = styled(
  (
    props: ProgressBarStyleProps & LinearProgressProps & {showing?: boolean},
  ) => {
    const {
      barColor,
      backgroundColor,
      borderRadius,
      showing,
      textColor: _,
      ...otherProps
    } = props
    return <LinearProgress {...otherProps} />
  },
)`
  height: ${(props) => props.thickness}px !important;
  border-radius: ${(props) => props.borderRadius}px !important;
  background: ${(props) => props.backgroundColor}!important;

  div {
    background: ${(props) => props.barColor} !important;
  }
`

const StyledTypography = styled(
  (props: ProgressBarStyleProps & TypographyProps) => {
    const {textColor, ...otherProps} = props
    return <Typography {...otherProps} />
  },
)`
  color: ${(props) => props.textColor} !important;
`
