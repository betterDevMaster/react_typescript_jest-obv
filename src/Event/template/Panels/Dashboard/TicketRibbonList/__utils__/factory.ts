import {TicketRibbon} from 'Event/template/Panels/Dashboard/TicketRibbonList/Ribbon'
import faker from 'faker'

export const fakeTicketRibbon = (
  overrides?: Partial<TicketRibbon>,
): TicketRibbon => ({
  rules: [],
  textColor: '#FFFFFF',
  backgroundColor: 'blue',
  letter: faker.random.alphaNumeric()[0],
  letterUpload: null,
  hoverText: faker.random.word(),
  hoverUpload: null,
  hoverTextFontStyles: [],
  ...overrides,
})
