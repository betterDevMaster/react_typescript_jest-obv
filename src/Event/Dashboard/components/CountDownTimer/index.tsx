import React, {useCallback, useState, useEffect} from 'react'
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import {now, date, duration, inThreeDays, Duration} from 'lib/date-time'
import {rgba} from 'lib/color'
import {useInterval} from 'lib/interval'
import {HashMap, Ordered} from 'lib/list'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {withDefaults} from 'lib/object'
import {DeepRequired} from 'lib/type-utils'

export interface CountDownTimer extends Ordered {
  enabled: boolean
  end: string
  backgroundColor: string
  textColor: string
  backgroundOpacity: number
  description: string
  numberColor: string
  numberBackgroundColor: string
  numberBackgroundOpacity: number
  numberBackgroundRadius: number
  separator: string
}

export const createCountdown = (): CountDownTimer => ({
  enabled: true,
  description: '',
  end: inThreeDays(),
  backgroundColor: '#FFFFFF',
  backgroundOpacity: 1,
  textColor: '#000000',
  numberColor: '#000000',
  numberBackgroundColor: '#FFFFFF',
  numberBackgroundOpacity: 0,
  numberBackgroundRadius: 0,
  separator: ':',
})

const countDownTimerDefaults = createCountdown()

export function setCountDownTimerDefaults(timers: HashMap<CountDownTimer>) {
  return Object.entries(timers).reduce((acc, [id, timer]) => {
    acc[id] = withDefaults(
      countDownTimerDefaults,
      timer,
    ) as DeepRequired<CountDownTimer>
    return acc
  }, {} as DeepRequired<HashMap<CountDownTimer>>)
}

type CountDownTimerProps = CountDownTimer & {
  id: string
  narrow?: boolean
  onRender?: () => void
}

export default function CountDownTimer(props: CountDownTimerProps) {
  const [showing, setShowing] = useState(true)
  const [timeLeft, setTimeLeft] = useState<Duration>({
    hours: '00',
    minutes: '00',
    seconds: '00',
  })
  const isEditMode = useEditMode()

  const {
    textColor,
    backgroundColor,
    backgroundOpacity: opacity,
    end,
    enabled,
    description,
    narrow,
    onRender,
  } = props

  const background = backgroundColor
    ? rgba(backgroundColor, opacity)
    : '#000000'

  const update = useCallback(() => {
    if (!showing || !enabled || !end) {
      // Nothing to update
      return
    }

    const current = now()
    const isAfter = date(end).isAfter(current)
    const diff = duration(current, end)

    setShowing(isAfter)
    setTimeLeft(diff)
  }, [enabled, end, showing])

  useInterval(update, 1000)

  const checkHidden = () => {
    if (isEditMode) {
      return false
    }

    return !showing || !enabled
  }

  const isHidden = checkHidden()

  /**
   * Notify any parents that we're now rendering content
   * in case they need to re-calculate sizes.
   */
  useEffect(() => {
    if (isHidden) {
      return
    }

    onRender && onRender()
  }, [isHidden, onRender])

  if (isHidden) {
    return null
  }

  return (
    <StyledCountDownTimer
      color={textColor}
      background={background}
      narrow={narrow}
      aria-label="count down timer"
    >
      <Body {...props} showing={showing} timeLeft={timeLeft} />
      <Typography>{description}</Typography>
    </StyledCountDownTimer>
  )
}

function Body(
  props: CountDownTimerProps & {
    timeLeft: Duration
    showing: boolean
  },
) {
  const {
    numberColor,
    numberBackgroundColor,
    numberBackgroundOpacity,
    numberBackgroundRadius,
    separator,
    description,
    id,
    timeLeft,
    narrow,
  } = props

  const numberBackground = numberBackgroundColor
    ? rgba(numberBackgroundColor, numberBackgroundOpacity)
    : '#FFFFFF'

  const hasDescription = Boolean(description)

  // Check whether a duration's index is the last unit. Useful to check if
  // we need to render a separator.
  const isLast = (index: number) => index === Object.keys(timeLeft).length - 1

  return (
    <Box bottomSpacing={hasDescription}>
      {Object.keys(timeLeft).map((key, index) => (
        <React.Fragment key={`${id}-${key}`}>
          <StyledCountDownNumber
            narrow={narrow}
            color={numberColor}
            background={numberBackground}
            radius={numberBackgroundRadius}
          >
            {Object.values(timeLeft)[index]}
          </StyledCountDownNumber>
          <StyledCountDownSeparator showing={!isLast(index)} panel={narrow}>
            {separator}
          </StyledCountDownSeparator>
        </React.Fragment>
      ))}
    </Box>
  )
}

const Box = styled.div<{bottomSpacing: boolean}>`
  display: flex;
  justify-content: center;
  margin-bottom: ${(props) =>
    props.bottomSpacing ? props.theme.spacing[4] : 0};
`

const StyledCountDownTimer = styled.div<{
  narrow?: boolean
  color: string
  background: string
}>`
  text-align: center;
  padding: ${(props) =>
    props.narrow ? props.theme.spacing[4] : props.theme.spacing[6]};
  font-size: ${(props) => (props.narrow ? 24 : 36)}px;
  font-weight: bold;
  line-height: 1em;
  color: ${(props) => props.color};
  background-color: ${(props) => props.background};

  @media (min-width: ${(props) => props.theme.breakpoints.lg}) {
    font-size: 36px;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    font-size: 36px;
    padding: ${(props) => props.theme.spacing[4]};
  }
`

const StyledCountDownNumber = styled.span<{
  narrow?: boolean
  color: string
  background: string
  radius: number
}>`
  color: ${(props) => props.color};
  background-color: ${(props) => props.background};
  padding: ${(props) =>
    props.narrow ? props.theme.spacing[2] : props.theme.spacing[4]};
  border-radius: ${(props) => props.radius * 100}%;
  min-width: 64px;

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    padding: ${(props) => props.theme.spacing[2]};
  }
`

const StyledCountDownSeparator = styled.span<{
  panel?: boolean
  showing: boolean
}>`
  ${(props) => (props.showing ? '' : 'display: none;')}
  padding: ${(props) =>
    props.panel ? props.theme.spacing[2] : props.theme.spacing[4]};

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    padding: ${(props) => props.theme.spacing[2]};
  }
`
