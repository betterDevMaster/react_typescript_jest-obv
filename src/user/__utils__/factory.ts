import {User} from 'user'
import faker from 'faker'

export const fakeUser = (overrides?: Partial<User>): User => ({
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  email: faker.internet.email(),
  ...overrides,
})
