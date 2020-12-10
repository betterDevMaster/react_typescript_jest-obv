import {fakeUser} from 'auth/user/__utils__/factory'
import {Attendee} from 'Event/attendee'
import faker from 'faker'

export const fakeAttendee = (overrides?: Partial<Attendee>): Attendee => ({
  ...fakeUser(),
  login_token: faker.random.alphaNumeric(8),
  waiver: null,
  has_password: true,
  groups: {},
  tags: [],
  ...overrides,
})
