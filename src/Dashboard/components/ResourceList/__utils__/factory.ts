import {Resource, RESOURCE_ICON} from 'Dashboard/components/ResourceList'
import faker from 'faker'

export const fakeResource = (): Resource => ({
  name: faker.random.word(),
  filePath: faker.internet.url(),
  icon: faker.random.arrayElement(Object.values(RESOURCE_ICON)),
})
