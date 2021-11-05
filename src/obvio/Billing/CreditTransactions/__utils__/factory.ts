import {
  AdditionalRoomsTransaction,
  AttendeesTransaction,
} from 'obvio/Billing/CreditTransactions'
import faker from 'faker'

export const fakeAttendeesTransaction = (
  overrides?: Partial<AttendeesTransaction>,
): AttendeesTransaction => ({
  id: faker.random.number({min: 1000, max: 10000}),
  event_name: faker.company.companyName(),
  event_slug: faker.internet.domainWord(),
  paid: true,
  amount: faker.random.number({min: 1, max: 100}),
  type_id: 1,
  details: {
    num_attendees: faker.random.number({min: 1, max: 100}),
    duration_days: faker.random.number({min: 1, max: 10}),
  },
  ...overrides,
})

export const fakeAdditionalRoomsTransaction = (
  overrides?: Partial<AdditionalRoomsTransaction>,
): AdditionalRoomsTransaction => ({
  id: faker.random.number({min: 1000, max: 10000}),
  event_name: faker.company.companyName(),
  event_slug: faker.internet.domainWord(),
  paid: true,
  amount: faker.random.number({min: 1, max: 100}),
  type_id: 2,
  details: {
    num_rooms: faker.random.number({min: 1, max: 10}),
  },
  ...overrides,
})
