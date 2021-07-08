import faker from 'faker'
import axios from 'axios'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {fireEvent} from '@testing-library/react'
import {goToAttendeeManagement} from 'organization/Event/AttendeeManagement/__utils__/go-to-attendee-management'
import {UPDATE_ATTENDEES} from 'organization/PermissionsProvider'

const mockPost = axios.post as jest.Mock

it('should import attendees', async () => {
  const attendees = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    fakeAttendee,
  )

  const {findByLabelText, findByText} = await goToAttendeeManagement({
    attendees,
    userPermissions: [UPDATE_ATTENDEES],
  })

  const file = new File([], 'attendees.csv')
  const fileInput = await findByLabelText('attendee import input')
  Object.defineProperty(fileInput, 'files', {
    value: [file],
  })

  const message = 'Form export request received!'
  mockPost.mockImplementationOnce(() =>
    Promise.resolve({
      data: {message},
    }),
  )

  fireEvent.change(fileInput)

  expect(await findByText(message)).toBeInTheDocument()
})
