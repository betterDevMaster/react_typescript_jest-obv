import {ALL_TICKET_RIBBONS} from 'Dashboard/component/TicketRibbon'
import faker from 'faker'

export function withTicketRibbon<T>(attributes: T): T {
  return {
    ...attributes,
    ticketRibbon: faker.random.arrayElement(ALL_TICKET_RIBBONS),
  }
}
