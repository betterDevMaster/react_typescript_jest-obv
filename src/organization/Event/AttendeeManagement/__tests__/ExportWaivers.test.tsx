import axios from 'axios'
import user from '@testing-library/user-event'
import {goToAttendeeManagement} from 'organization/Event/AttendeeManagement/__utils__/go-to-attendee-management'

const mockGet = axios.get as jest.Mock

it('should show exported message', async () => {
  const {findByLabelText, findByText} = await goToAttendeeManagement()

  const message =
    "We will send you email with download link once it's generated."
  mockGet.mockImplementationOnce(() => Promise.resolve({data: {message}}))

  user.click(await findByLabelText('export waivers'))

  expect(await findByText(message)).toBeInTheDocument()
})
