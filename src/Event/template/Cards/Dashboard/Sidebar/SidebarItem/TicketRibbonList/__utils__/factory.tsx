import {
  RIBBONS,
  TicketRibbonProps,
} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/TicketRibbonList/TicketRibbon'
import faker from 'faker'

export const fakeTicketRibbon = (
  overrides?: Partial<TicketRibbonProps>,
): TicketRibbonProps => ({
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
