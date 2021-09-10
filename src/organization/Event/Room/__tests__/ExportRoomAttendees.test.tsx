import axios from 'axios'
import user from '@testing-library/user-event'
import {START_ROOMS} from 'organization/PermissionsProvider'
import {fakeRoom} from 'organization/Event/AreaList/__utils__/factory'
import {goToRoomConfig} from 'organization/Event/Room/__utils__/go-to-room-config'

const mockGet = axios.get as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should export submissions for a form', async () => {
  const room = fakeRoom()

  const {findByLabelText, findByText} = await goToRoomConfig({
    userPermissions: [START_ROOMS],
    room,
  })

  const message = 'received export request'
  mockGet.mockImplementationOnce(() => Promise.resolve({data: {message}}))

  user.click(await findByLabelText('export attendees'))

  expect(await findByText(message)).toBeInTheDocument()
})
