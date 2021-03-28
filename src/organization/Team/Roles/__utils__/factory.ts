import {Role} from 'organization/Team/Roles/RolesProvider'
import faker from 'faker'

export const fakeRole = (overrides?: Partial<Role>): Role => ({
  id: faker.random.number({min: 1000, max: 2000}),
  name: faker.random.word(),
  permissions: [],
  ...overrides,
})
