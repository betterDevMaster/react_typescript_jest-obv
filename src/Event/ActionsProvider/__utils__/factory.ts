import {Action} from 'Event/ActionsProvider'
import faker from 'faker'

export const fakeAction = (overrides?: Partial<Action>): Action => ({
  id: faker.random.number({min: 1, max: 1000}),
  description: faker.lorem.sentence(),
  points: faker.random.number({min: 10, max: 100}),
  max_per_day: 1,
  max_per_event: 10,
  is_active: faker.random.boolean(),
  has_random_points: false,
  random_min_points: null,
  random_max_points: null,
  ...overrides,
})
