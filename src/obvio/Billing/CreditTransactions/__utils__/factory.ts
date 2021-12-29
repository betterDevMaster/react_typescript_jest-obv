import {
  EventCreditTransaction,
  PurchaseCreditTransaction,
} from 'obvio/Billing/CreditTransactions'
import faker from 'faker'

export const fakeEventCreditTransaction = (
  overrides?: Partial<EventCreditTransaction>,
): EventCreditTransaction => ({
  transaction_type: 'event',
  id: faker.random.number({min: 1000, max: 10000}),
  event_name: faker.company.companyName(),
  event_slug: faker.internet.domainWord(),
  total: faker.random.number({min: 1, max: 100}),
  ...overrides,
})

export const fakePurchaseCreditTransaction = (
  overrides?: Partial<PurchaseCreditTransaction>,
): PurchaseCreditTransaction => ({
  transaction_type: 'purchase',
  id: faker.random.number({min: 1000, max: 10000}),
  total: faker.random.number({min: 1, max: 100}),
  ...overrides,
})
