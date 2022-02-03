import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import React, {useState} from 'react'
import {
  CountDownTimerSettings,
  createCountdown,
} from 'Event/Dashboard/components/CountDownTimer'
import TimerConfig from 'Event/template/Panels/Dashboard/CountDownTimers/CountDownTimer/TimerConfig'

export default function NewCountDownTimerButton(props: {className?: string}) {
  const [
    countDownTimer,
    setCountDownTimer,
  ] = useState<CountDownTimerSettings | null>(null)

  const clearCountDownTimer = () => setCountDownTimer(null)

  const addCountDownTimer = () => {
    setCountDownTimer(createCountdown())
  }
  return (
    <>
      <NewCountDownTimerConfig
        timer={countDownTimer}
        onClose={clearCountDownTimer}
      />
      <Grid item xs={12} className={props.className}>
        <Button
          fullWidth
          size="large"
          variant="outlined"
          color="primary"
          aria-label="add count down timer"
          onClick={addCountDownTimer}
        >
          Add Countdown
        </Button>
      </Grid>
    </>
  )
}

function NewCountDownTimerConfig(props: {
  timer: CountDownTimerSettings | null
  onClose: () => void
}) {
  if (!props.timer) {
    return null
  }

  return (
    <TimerConfig
      isVisible
      onClose={props.onClose}
      countDownTimer={props.timer}
    />
  )
}
