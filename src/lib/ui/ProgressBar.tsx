import React from 'react'
import LinearProgress, {
  LinearProgressProps,
} from '@material-ui/core/LinearProgress'
import Typography, {TypographyProps} from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import styled from 'styled-components'

export interface ProgressBarStyleProps {
  barColor?: string
  textColor?: string
}

export type ProgressBarProps = {
  value: number
} & ProgressBarStyleProps

export default function ProgressBar(
  props: LinearProgressProps & ProgressBarProps,
) {
  return (
    <Box display="flex" alignItems="center" mb={3}>
      <Box width="100%" mr={1}>
        <StyledLinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <StyledTypography
          variant="body2"
          textColor={props.textColor}
        >{`${Math.round(props.value)}%`}</StyledTypography>
      </Box>
    </Box>
  )
}

const StyledLinearProgress = styled(
  (props: ProgressBarStyleProps & LinearProgressProps) => {
    const {barColor, textColor: _, ...otherProps} = props
    return <LinearProgress {...otherProps} />
  },
)`
  height: 15px !important;
  border-radius: 10px !important;
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