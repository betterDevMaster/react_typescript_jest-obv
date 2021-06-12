import {Resource} from 'Event/template/Panels/Dashboard/Resources/ResourceList'
import faker from 'faker'

export const fakeResource = (overrides?: Partial<Resource>): Resource => ({
  name: faker.random.word(),
  filePath: faker.internet.url(),
  description: faker.random.word(),
  isVisible: faker.random.boolean(),
  rules: [],
  ...overrides,
})

export function withResources<T>(attributes: T): T {
  return {
    ...attributes,
    resourceList: {
      title: faker.random.word(),
      description: faker.lorem.paragraph(),
      resources: Array.from(
        {length: faker.random.number({min: 1, max: 6})},
        fakeResource,
      ),
    },
  }
}
