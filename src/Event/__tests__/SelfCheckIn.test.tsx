import {loginToEventSite} from 'Event/__utils__/url'
import faker from 'faker'
import axios from 'axios'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {wait} from '@testing-library/react'

const mockPut = axios.put as jest.Mock
const mockGet = axios.get as jest.Mock

it('should complete tech check', async () => {
  const beforeCheckIn = fakeAttendee({
    has_password: true,
    waiver: faker.internet.url(),
    tech_check_completed_at: null,
  })

  const afterCheckIn = {
    ...beforeCheckIn,
    tech_check_completed_at: faker.date.recent().toISOString(),
  }
  const {findByLabelText} = await loginToEventSite({
    attendee: beforeCheckIn,
    skipLogin: true,
    pathname: '/check_in',
    beforeRender: () => {
      mockPut.mockImplementationOnce(() =>
        Promise.resolve({data: afterCheckIn}),
      )
      mockGet.mockImplementation(() => Promise.resolve({data: afterCheckIn}))
    },
  })

  /**
   * Completed tech check
   */
  await wait(async () => {
    expect(await findByLabelText('welcome')).toBeInTheDocument()
  })
})
