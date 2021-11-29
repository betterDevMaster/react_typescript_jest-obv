import React, {useCallback, useState, useEffect} from 'react'
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import {now, date, duration, formatDate, inThreeDays} from 'lib/date-time'
import {rgba} from 'lib/color'
import {useInterval} from 'lib/interval'
import {Ordered} from 'lib/list'

export interface CountDownTimer extends Ordered {
  enabled: boolean
  end: string
  backgroundColor: string
  textColor: string
  backgroundOpacity: number
  description: string
}

export const createCountdown = (): CountDownTimer => ({
  enabled: true,
  description: '',
  end: inThreeDays(),
  backgroundColor: '#FFFFFF',
  backgroundOpacity: 1,
  textColor: '#000000',
})

export default function CountDownTimer(
  props: CountDownTimer & {
    isEditMode: boolean
    onRender?: () => void
  },
) {
  const [showing, setShowing] = useState(true)
  const [timeLeft, setTimeLeft] = useState('')

  const {
    textColor,
    backgroundColor,
    backgroundOpacity: opacity,
    end,
    enabled,
    description,
    isEditMode,
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

    return !showing || !enabled || !value()
  }

  const value = () => {
    if (isEditMode) {
      const fullDateFormat = 'MMM Do YYYY HH:mm:ss'
      return end ? formatDate(end, fullDateFormat) : ''
    }

    return timeLeft
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
      aria-label="count down timer"
    >
      {value()}
      <Typography>{description}</Typography>
    </StyledCountDownTimer>
  )
}

const StyledCountDownTimer = styled((props) => {
  return <div {...props} />
})`
  text-align: center;
  padding: ${(props) => props.theme.spacing[6]};
  font-size: 60px;
  font-weight: bold;
  line-height: 1em;
  color: ${(props) => props.color};
  background-color: ${(props) => props.background};
  opacity: ${(props) => props.opacity};

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    font-size: 36px;
  }
`
