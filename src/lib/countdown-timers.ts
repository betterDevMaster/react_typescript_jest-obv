import {CountDownTimerSettings} from 'Event/Dashboard/components/CountDownTimer'
import {now, date} from 'lib/date-time'

export const useHasCountDownTimers = (
  countDownTimers: Record<string, CountDownTimerSettings>,
) => {
  if (Object.keys(countDownTimers).length === 0) {
    return null
  }

  const current = now()
  for (const key in countDownTimers) {
    const isAfter = date(countDownTimers[key].end).isAfter(current)
    if (countDownTimers[key].enabled === true && isAfter) {
      return true
    }
  }
  return null
}
