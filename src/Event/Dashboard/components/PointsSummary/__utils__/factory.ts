import {Points} from 'Event/Dashboard/components/PointsSummary'
import faker from 'faker'

export const fakePoints = (overrides?: Partial<Points>): Points => ({
  headerImage:
    'https://obv-public.s3.amazonaws.com/the_virtual_event_on_virtual_events/images/Logos/Power_Points.png',
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
