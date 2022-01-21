import faker from 'faker'
import {CountDownTimerSettings} from 'Event/Dashboard/components/CountDownTimer'
import {now} from 'lib/date-time'

export const fakeCountDownTimer = (
  overrides?: Partial<CountDownTimerSettings>,
): CountDownTimerSettings => {
  return {
    enabled: true,
    description: faker.random.words(3),
    end: now(),
    backgroundColor: '#ffffff',
    backgroundOpacity: 1,
    textColor: '#000000',
    numberColor: '#000000',
    numberBackgroundColor: '#FFFFFF',
    numberBackgroundOpacity: 1,
    numberBackgroundRadius: 0,
    separator: ':',
    ...overrides,
  }
}
