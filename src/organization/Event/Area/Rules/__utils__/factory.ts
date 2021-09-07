import {Rule} from 'organization/Event/Area/Rules/RulesProvider'
import faker from 'faker'

export const fakeRule = (overrides?: Partial<Rule>): Rule => ({
  id: faker.random.number({min: 1, max: 10000}),
  conditions: [],
  rooms: [],
  ...overrides,
})
