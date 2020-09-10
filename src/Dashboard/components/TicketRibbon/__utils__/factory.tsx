import {TicketRibbon} from 'Dashboard/components/TicketRibbon'

import faker from 'faker'

const images = [
  'https://tax.live/success_summit/ribbons/GUEST.png',
  'https://tax.live/success_summit/ribbons/GOLD.png',
  'https://tax.live/success_summit/ribbons/APN.png',
  'https://tax.live/success_summit/ribbons/MASTERMIND.png',
  'https://tax.live/success_summit/ribbons/DIAMOND.png',
]

export const fakeTicketRibbon = (): TicketRibbon => ({
  name: faker.random.word(),
  image: faker.random.arrayElement(images),
})
