import {ObvioEvent} from 'Event'
import {fakeSimpleBlog} from 'Event/Dashboard/Template/SimpleBlog/__utils__/factory'
import faker from 'faker'

export const fakeEvent = (): ObvioEvent => ({
  id: faker.random.number({min: 1000, max: 10000}),
  name: faker.company.companyName(),
  slug: faker.internet.domainWord(),
  dashboard: fakeSimpleBlog(),
})
