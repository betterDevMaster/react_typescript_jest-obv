import {duration} from 'lib/date-time'
import faker from 'faker'
import moment from 'moment'

it('should have days if the period is longer than a day', () => {
  const start = faker.date.recent(0)
  const end = faker.date.between(
    moment(start).add(1, 'days').toDate(),
    moment(start).add(10, 'days').toDate(),
  )

  const period = duration(start.toDateString(), end.toDateString())

  expect(period.days).not.toBeUndefined()
})

it('should not have days if the period is less than a day', () => {
  const start = moment().toISOString()
  const period = duration(start, moment(start).add(23, 'hours').toISOString())

  expect(period.days).toBeUndefined()
})

it('should all elements have more than 2 characters', () => {
  const start = faker.date.recent()
  const end = faker.date.recent()
  const period = duration(start.toDateString(), end.toDateString())

  expect(period.hours.length).toBeGreaterThanOrEqual(2)
  expect(period.minutes.length).toBeGreaterThanOrEqual(2)
  expect(period.seconds.length).toBeGreaterThanOrEqual(2)
})
