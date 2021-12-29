import {
  EventCreditTransaction,
  PurchaseCreditTransaction,
} from 'obvio/Billing/CreditTransactions'
import faker from 'faker'
import {now} from 'lib/date-time'

export const fakeEventCreditTransaction = (
  overrides?: Partial<EventCreditTransaction>,
): EventCreditTransaction => ({
  last_transaction: now(),
  event_start: now(),
  event_end: now(),
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
  last_transaction: now(),
  id: faker.random.number({min: 1000, max: 10000}),
  total: faker.random.number({min: 1, max: 100}),
  ...overrides,
})
