import {CountDownTimer} from 'Event/Dashboard/components/CountDownTimer'

export const useHasCountDownTimers = (
  countDownTimers: Record<string, CountDownTimer>,
) => {
  if (Object.keys(countDownTimers).length === 0) {
    return null
  }

  for (const key in countDownTimers) {
    if (countDownTimers[key].enabled === true) {
      return true
    }
  }
  return null
}
