import React, {useState} from 'react'
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles'
import LinearProgress, {
  LinearProgressProps,
} from '@material-ui/core/LinearProgress'
import Typography, {TypographyProps} from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import styled from 'styled-components'
import Container from '@material-ui/core/Container'

export interface ProgressBarStyleProps {
  barColor: string
  backgroundColor: string
  textColor: string
  checkInColor: string
  thickness: number
  borderRadius: number
}

export type ProgressBarProps = {
  value: number
  showing: boolean
  checkInTitle: string
  text: string
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
        <BarContainer thickness={props.thickness}>
          <StyledLinearProgress variant="determinate" {...props} />
          <StyledTypography
            variant="body2"
            textColor={props.checkInColor}
            thickness={props.thickness}
          >
            {props.checkInTitle}&nbsp;
          </StyledTypography>
          <StyledTypography
            variant="body2"
            textColor={props.textColor}
            thickness={props.thickness}
          >
            {props.text}
          </StyledTypography>
        </BarContainer>
      </Box>
    </Container>
  )
}

const BarContainer = styled.div<{
  thickness: number | undefined
}>`
  width: 100%;
  position: relative;
  height: ${(props) => props.thickness}px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyledLinearProgress = styled(
  (
    props: ProgressBarStyleProps & LinearProgressProps & {showing?: boolean},
  ) => {
    // Add a delay to set the progress so that the bar animates on load
    const [innerProgress, setInnerProgress] = useState<number | undefined>(0)
    React.useEffect(() => {
      const timeout = setTimeout(() => {
        setInnerProgress(props.value)
      }, 200)
      return () => {
        clearTimeout(timeout)
      }
    }, [props.value])

    const useStylesLinerProgress = makeStyles((theme: Theme) =>
      createStyles({
        root: {
          height: props.thickness,
          borderRadius: props.borderRadius,
          zIndex: 0,
        },
        colorPrimary: {
          backgroundColor: props.backgroundColor,
        },
        bar: {
          borderRadius: props.borderRadius,
          backgroundColor: props.barColor,
        },
      }),
    )
    const classes = useStylesLinerProgress()
    const {
      barColor,
      backgroundColor,
      borderRadius,
      showing,
      textColor: _,
      ...otherProps
    } = props
    return (
      <LinearProgress classes={classes} {...otherProps} value={innerProgress} />
    )
  },
)`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
`

const StyledTypography = styled(
  (
    props: Pick<ProgressBarStyleProps, 'textColor' | 'thickness'> &
      TypographyProps,
  ) => {
    const {textColor, thickness, ...otherProps} = props
    return <Typography {...otherProps} />
  },
)`
  z-index: 1;
  font-size: ${(props) => props.thickness / 2}px;
  color: ${(props) => props.textColor} !important;
`
