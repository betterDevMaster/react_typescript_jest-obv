import user from '@testing-library/user-event'
import axios from 'axios'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {goToAttendeeManagement} from 'organization/Event/AttendeeManagement/__utils__/go-to-attendee-management'
import {wait} from '@testing-library/react'
import {UPDATE_ATTENDEES} from 'organization/PermissionsProvider'

const mockDelete = axios.delete as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should clear attendee password', async () => {
  const attendee = fakeAttendee({
    has_password: true,
  })

  const {
    findByText,
    findByLabelText,
    queryByText,
  } = await goToAttendeeManagement({
    userPermissions: [UPDATE_ATTENDEES],
    attendees: [attendee],
  })

  user.click(await findByLabelText('edit'))

  const withoutPassword = {
    ...attendee,
    has_password: false,
  }
  mockDelete.mockImplementationOnce(() =>
    Promise.resolve({data: withoutPassword}),
  )

  user.click(await findByText(/clear password/i))

  await wait(() => {
    expect(queryByText(/clear password/i)).not.toBeInTheDocument()
  })
})
