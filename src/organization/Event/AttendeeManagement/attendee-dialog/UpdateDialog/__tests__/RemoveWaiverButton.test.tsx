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

it('should remove a waiver', async () => {
  const attendee = fakeAttendee({
    waiver: 'haswaiver.pdf',
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

  const withoutWaiver = {
    ...attendee,
    waiver: null,
  }
  mockDelete.mockImplementationOnce(() =>
    Promise.resolve({data: withoutWaiver}),
  )

  user.click(await findByText(/remove waiver/i))

  await wait(() => {
    expect(queryByText(/remove waiver/i)).not.toBeInTheDocument()
  })
})
