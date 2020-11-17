import {User} from 'auth/user'
import faker from 'faker'

export const fakeUser = (overrides?: Partial<User>): User => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  ...overrides,
})
