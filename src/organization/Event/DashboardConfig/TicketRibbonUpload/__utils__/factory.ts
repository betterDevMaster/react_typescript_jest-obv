import faker from 'faker'
import {CustomTicketRibbon} from 'organization/Event/DashboardConfig/TicketRibbonUpload'

export const fakeCustomRibbon = (
  overrides?: Partial<CustomTicketRibbon>,
): CustomTicketRibbon => ({
  id: faker.random.number({min: 1000, max: 10000}),
  image: {
    name: 'customribbon.jpg',
    url: faker.internet.url(),
  },
  ...overrides,
})
