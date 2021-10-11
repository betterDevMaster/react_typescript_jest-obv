import faker from 'faker'
import {AccessToken} from 'organization/Event/Services/AccessTokens/AccessTokensProvider'

export const fakeAccessToken = (
  overrides?: Partial<AccessToken>,
): AccessToken => ({
  id: faker.random.number({min: 1000, max: 10000}),
  value: faker.random.alphaNumeric(20),
  ...overrides,
})
