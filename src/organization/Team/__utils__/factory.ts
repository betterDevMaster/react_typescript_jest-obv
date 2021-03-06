import {TeamMember} from 'auth/user'
import faker from 'faker'
import {fakeUser} from 'auth/user/__utils__/factory'
import {TeamInvitation} from 'organization/Team/TeamInvitationsProvider'

export const fakeTeamMember = (
  overrides?: Partial<TeamMember>,
): TeamMember => ({
  ...fakeUser(),
  permissions: [],
  role: null,
  has_active_subscription: false,
  credits: 0,
  plan: null,
  has_payment_method: false,
  feature_flags: [],
  has_unpaid_transactions: false,
  is_admin: false,
  ...overrides,
})

export const fakeTeamInvitation = (
  overrides?: Partial<TeamInvitation>,
): TeamInvitation => ({
  id: faker.random.number({min: 1000, max: 10000}),
  email: faker.internet.email(),
  token: faker.random.alphaNumeric(8),
  role: null,
  ...overrides,
})
