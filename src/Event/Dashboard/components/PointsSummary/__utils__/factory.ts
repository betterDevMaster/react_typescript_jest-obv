import {Points} from 'Event/Dashboard/components/PointsSummary'
import faker from 'faker'

export const fakePoints = (overrides?: Partial<Points>): Points => ({
  description: faker.lorem.paragraph(1),
  unit: `${faker.random.word()} Rewards`,
  ...overrides,
})

export function withPoints<T>(attributes: T): T {
  return {
    ...attributes,
    points: fakePoints(),
  }
}
