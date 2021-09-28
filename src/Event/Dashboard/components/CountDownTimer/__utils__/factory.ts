import faker from 'faker'
import {pipe} from 'ramda'
import {sometimes} from '__utils__/attributes'
import {CountDownTimer} from 'Event/Dashboard/components/CountDownTimer'

export const fakeCountDownTimer = (
  overrides?: Partial<CountDownTimer>,
): CountDownTimer => {
  const defaultAttributes: CountDownTimer = {
    enabled: true,
    description: faker.random.words(3),
  }

  const makeAttributes: (nb: CountDownTimer) => CountDownTimer = pipe(
    sometimes<CountDownTimer>(withBackground),
    sometimes<CountDownTimer>(withOpacity),
    sometimes<CountDownTimer>(withTextColor),
  )

  return {
    ...makeAttributes(defaultAttributes),
    ...overrides,
  }
}

function withBackground(countdownTimer: CountDownTimer): CountDownTimer {
  return {
    ...countdownTimer,
    backgroundColor: faker.internet.color(),
  }
}

function withOpacity(countdownTimer: CountDownTimer): CountDownTimer {
  return {
    ...countdownTimer,
    opacity: faker.random.number({min: 0, max: 1}),
  }
}

function withTextColor(countdownTimer: CountDownTimer): CountDownTimer {
  return {
    ...countdownTimer,
    textColor: faker.internet.color(),
  }
}
