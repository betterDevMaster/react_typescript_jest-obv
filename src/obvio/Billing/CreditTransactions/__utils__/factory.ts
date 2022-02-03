import {
  CreditTransactionBase,
  EventCreditTransaction,
  PurchaseCreditTransaction,
  SubscriptionCreditsTransaction,
} from 'obvio/Billing/CreditTransactions'
import faker from 'faker'
import {now} from 'lib/date-time'

const fakeBaseTransaction = (): CreditTransactionBase => ({
  last_transaction: now(),
  id: faker.random.number({min: 1000, max: 10000}),
  total: faker.random.number({min: 1, max: 100}),
  plan: 'basic',
})

export const fakeEventCreditTransaction = (
  overrides?: Partial<EventCreditTransaction>,
): EventCreditTransaction => ({
  ...fakeBaseTransaction(),
  event_start: now(),
  event_end: now(),
  transaction_group: 'event_deduction',
  event_name: faker.company.companyName(),
  event_slug: faker.internet.domainWord(),
  ...overrides,
})

export const fakePurchaseCreditTransaction = (
  overrides?: Partial<PurchaseCreditTransaction>,
): PurchaseCreditTransaction => ({
  ...fakeBaseTransaction(),
  transaction_group: 'addition',
  type: 'purchase',
  ...overrides,
})

export const fakeSubscriptionCreditTransaction = (
  overrides?: Partial<SubscriptionCreditsTransaction>,
): SubscriptionCreditsTransaction => ({
  ...fakeBaseTransaction(),
  transaction_group: 'addition',
  type: 'subscription_credits',
  ...overrides,
})
