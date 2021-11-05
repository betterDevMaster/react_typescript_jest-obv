import axios from 'axios'
import user from '@testing-library/user-event'
import {goToAttendeeManagement} from 'organization/Event/AttendeeManagement/__utils__/go-to-attendee-management'
import {fakeEvent} from 'Event/__utils__/factory'

const mockPost = axios.post as jest.Mock

it('should show sync started message', async () => {
  const event = fakeEvent({
    has_mailchimp: true, // required to see menu item
  })
  const {findByLabelText, findByText} = await goToAttendeeManagement({
    event,
  })

  mockPost.mockImplementationOnce(() => Promise.resolve({data: 'ok'}))

  user.click(await findByLabelText('select other action'))

  user.click(await findByText(/sync mailchimp tags/i))

  expect(await findByText(/mailchimp tags sync started/i)).toBeInTheDocument()
})
