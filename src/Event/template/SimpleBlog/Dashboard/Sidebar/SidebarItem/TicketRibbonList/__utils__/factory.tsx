import {
  RIBBONS,
  TicketRibbon,
} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/TicketRibbonList/Ribbon'
import faker from 'faker'

export const fakeTicketRibbon = (
  overrides?: Partial<TicketRibbon>,
): TicketRibbon => ({
  name: faker.random.arrayElement(RIBBONS),
  text: faker.random.word(),
  color: '#FFFFFF',
  rules: [],
  ...overrides,
})

export function withTicketRibbons<T>(attributes: T): T {
  return {
    ...attributes,
    ticketRibbons: Array.from(
      {length: faker.random.number({min: 1, max: 3})},
      fakeTicketRibbon,
    ),
  }
}
