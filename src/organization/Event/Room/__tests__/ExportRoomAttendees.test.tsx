import axios from 'axios'
import user from '@testing-library/user-event'
import {goToArea} from 'organization/Event/AreaList/__utils__/go-to-areas'
import {START_ROOMS} from 'organization/PermissionsProvider'
import {fakeRoom} from 'organization/Event/AreaList/__utils__/factory'

const mockGet = axios.get as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should export submissions for a form', async () => {
  const room = fakeRoom()

  const {findByLabelText, findByText} = await goToArea({
    userPermissions: [START_ROOMS],
    rooms: [room],
  })

  mockGet.mockImplementationOnce(() =>
    Promise.resolve({data: {url: 'http://zoom/start_url'}}),
  )

  // go to room config
  user.click(await findByLabelText(`view ${room.name} room`))

  const message = 'received export request'
  mockGet.mockImplementationOnce(() => Promise.resolve({data: {message}}))

  user.click(await findByLabelText('export attendees'))

  expect(await findByText(message)).toBeInTheDocument()
})
