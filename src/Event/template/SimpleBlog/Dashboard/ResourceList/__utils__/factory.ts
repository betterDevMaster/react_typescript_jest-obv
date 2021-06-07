import {RESOURCE_ICON} from 'Event/template/SimpleBlog/Dashboard/ResourceList'
import {Resource} from 'Event/template/SimpleBlog/Dashboard/ResourceList/ResourceItem'
import faker from 'faker'

export const fakeResource = (overrides?: Partial<Resource>): Resource => ({
  name: faker.random.word(),
  filePath: faker.internet.url(),
  icon: faker.random.arrayElement(Object.values(RESOURCE_ICON)),
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
