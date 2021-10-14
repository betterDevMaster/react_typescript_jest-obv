import user from '@testing-library/user-event'
import axios from 'axios'
import faker from 'faker'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {loginToEventSite} from 'Event/__utils__/url'
import {fakeEvent} from 'Event/__utils__/factory'
import {fakeCards} from 'Event/template/Cards/__utils__/factory'
import {wait} from '@testing-library/react'

const mockPatch = axios.patch as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should change the user password', async () => {
  const password = 'testpassword'
  const email = faker.internet.email()
  const token = 'secrettoken'
  const event = fakeEvent({template: fakeCards()})

  const attendee = fakeAttendee({
    email: email,
    login_token: token,
    has_password: true,
    waiver: faker.internet.url(),
    tech_check_completed_at: faker.date.recent().toISOString(),
  })
  const {findByLabelText} = await loginToEventSite({attendee, event})
  user.click(await findByLabelText('show side menu'))
  user.click(await findByLabelText('change password'))

  user.type(await findByLabelText('password'), password)
  user.type(await findByLabelText('password confirmation'), password)

  mockPatch.mockImplementationOnce(() => Promise.resolve({data: 'ok'}))

  user.click(await findByLabelText('submit'))

  await wait(() => {
    expect(mockPatch).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPatch.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}/password`)

  expect(await findByLabelText('back to dashboard')).toBeInTheDocument()

  expect(data.password).toBe(password)
  expect(data.password_confirmation).toBe(password)
})
