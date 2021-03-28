import {TeamMember} from 'auth/user'
import {fakeUser} from 'auth/user/__utils__/factory'

export const fakeTeamMember = (
  overrides?: Partial<TeamMember>,
): TeamMember => ({
  ...fakeUser(),
  permissions: [],
  role: null,
  has_paid: false,
  ...overrides,
})
