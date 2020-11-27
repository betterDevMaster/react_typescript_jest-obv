import {Attendee} from 'Event/attendee'
import faker from 'faker'

export const fakeAttendee = (overrides?: Partial<Attendee>): Attendee => ({
  first_name: faker.name.firstName(),
  last_name: faker.name.lastName(),
  email: faker.internet.email(),
  login_token: faker.random.alphaNumeric(8),
  waiver: null,
  groups: {},
  tags: [],
  ...overrides,
})
