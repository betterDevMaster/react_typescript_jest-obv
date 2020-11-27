import {User} from 'auth/user'
import faker from 'faker'

export const fakeUser = (overrides?: Partial<User>): User => ({
  first_name: faker.name.firstName(),
  last_name: faker.name.lastName(),
  email: faker.internet.email(),
  ...overrides,
})
