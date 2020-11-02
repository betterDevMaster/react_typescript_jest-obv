import {User} from 'user'
import faker from 'faker'

export const fakeUser = (overrides?: Partial<User>): User => ({
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  email: faker.internet.email(),
  group: faker.random.boolean() ? faker.random.word() : '',
  group2: faker.random.boolean() ? faker.random.word() : '',
  group3: faker.random.boolean() ? faker.random.word() : '',
  ...overrides,
})
