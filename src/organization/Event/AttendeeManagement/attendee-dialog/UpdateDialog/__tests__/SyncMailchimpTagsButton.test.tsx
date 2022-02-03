import user from '@testing-library/user-event'
import axios from 'axios'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {goToAttendeeManagement} from 'organization/Event/AttendeeManagement/__utils__/go-to-attendee-management'
import {wait} from '@testing-library/react'
import {UPDATE_ATTENDEES} from 'organization/PermissionsProvider'

const mockPost = axios.post as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should send a request to sync tags', async () => {
  const attendee = fakeAttendee({
    has_password: true,
    has_mailchimp: true,
  })

  const {findByText, findByLabelText} = await goToAttendeeManagement({
    userPermissions: [UPDATE_ATTENDEES],
    attendees: [attendee],
  })

  mockPost.mockImplementationOnce(() => Promise.resolve({data: null}))

  user.click(await findByLabelText('edit'))

  user.click(await findByText(/sync mailchimp tags/i))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })
})
