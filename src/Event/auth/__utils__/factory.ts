import {fakeUser} from 'auth/user/__utils__/factory'
import {Attendee} from 'Event/attendee'
import faker from 'faker'

export const fakeAttendee = (overrides?: Partial<Attendee>): Attendee => {
  const token = faker.random.alphaNumeric(8)

  return {
    ...fakeUser(),
    login_token: token,
    login_url: `http://virtual.obv.localhost:3000/login?token=${token}`,
    waiver: null,
    tech_check_completed_at: null,
    checked_in_at: null,
    has_password: true,
    groups: {},
    tags: [],
    has_completed_tech_check: true,
    has_checked_in: true,
    has_mailchimp: false,
    ...overrides,
  }
}
