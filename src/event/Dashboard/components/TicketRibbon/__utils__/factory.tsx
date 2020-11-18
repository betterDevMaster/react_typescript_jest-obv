import {ALL_TICKET_RIBBONS} from 'Event/Dashboard/components/TicketRibbon'
import faker from 'faker'

export function withTicketRibbon<T>(attributes: T): T {
  return {
    ...attributes,
    ticketRibbon: faker.random.arrayElement(ALL_TICKET_RIBBONS).name,
  }
}
