import {PaymentMethod, SetupIntent} from '@stripe/stripe-js'
import {Plan} from 'obvio/Billing/plans'

export const fakePlan = (overrides?: Partial<Plan>): Plan => ({
  name: 'founder',
  rooms_per_event: 3,
  organization_limit: 1,
  annual_credits: 1000,
  ...overrides,
})

export const fakeCard = (
  overrides?: Partial<PaymentMethod.Card>,
): PaymentMethod.Card => ({
  brand: 'visa',
  checks: {
    address_line1_check: null,
    address_postal_code_check: null,
    cvc_check: 'pass',
  },
  country: 'US',
  exp_month: 11,
  exp_year: 2022,
  fingerprint: 'f8rhnXM76G5W8D1A',
  funding: 'credit',
  last4: '1111',
  three_d_secure_usage: {supported: true},
  wallet: null,
  ...overrides,
})

export const fakeBillingDetails = (
  overrides?: Partial<PaymentMethod.BillingDetails>,
): PaymentMethod.BillingDetails => ({
  email: null,
  name: 'Mike Tes',
  phone: null,
  address: {
    city: null,
    country: null,
    line1: null,
    line2: null,
    postal_code: null,
    state: null,
  },
  ...overrides,
})

export const fakePaymentMethod = (
  overrides?: Partial<PaymentMethod>,
): PaymentMethod => ({
  created: 1635409618,
  customer: 'cus_KUSsVsa3OPBFm5',
  id: 'pm_1JpTwsCHAEEjpRy6hezM5gGD',
  livemode: false,
  metadata: {},
  object: 'payment_method',
  type: 'card',
  card: fakeCard(),
  billing_details: fakeBillingDetails(),
  ...overrides,
})

export const fakeSetupIntent = (
  overrides?: Partial<SetupIntent>,
): SetupIntent => ({
  cancellation_reason: null,
  client_secret: 'seti_client_secret',
  created: 1635509231,
  description: null,
  id: 'seti_id',
  last_setup_error: null,
  livemode: false,
  object: 'setup_intent',
  payment_method: null,
  payment_method_types: ['card'],
  status: 'requires_payment_method',
  usage: 'off_session',
  next_action: null,
  ...overrides,
})
