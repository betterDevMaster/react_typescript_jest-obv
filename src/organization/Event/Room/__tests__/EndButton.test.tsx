import {fakeRoom} from 'organization/Event/AreaList/__utils__/factory'
import user from '@testing-library/user-event'
import {goToRoomConfig} from 'organization/Event/Room/__utils__/go-to-room-config'
import {START_ROOMS} from 'organization/PermissionsProvider'
import axios from 'axios'
import {Room} from 'Event/room'
import {wait} from '@testing-library/dom'

const mockPatch = axios.patch as jest.Mock
const mockGet = axios.get as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should send an end meeting request', async () => {
  const startUrl = 'http://zoom/start_url'

  const room = fakeRoom({
    is_online: false,
  })

  const {findByText, findByLabelText} = await goToRoomConfig({
    room,
    userPermissions: [START_ROOMS],
    hasJoinedUsers: true,
  })

  expect(await findByText(/end meeting/i)).toBeDisabled()

  const online: Room = {
    ...room,
    is_online: true,
  }

  mockPatch.mockImplementationOnce(() => Promise.resolve({data: online}))

  mockGet.mockImplementationOnce(() => Promise.resolve({data: {url: startUrl}}))

  user.click(await findByLabelText('toggle online'))

  expect(await findByText(/end meeting/i)).not.toBeDisabled()

  mockPatch.mockImplementationOnce(() => Promise.resolve({data: online}))

  user.click(await findByText(/end meeting/i))
  user.click(await findByLabelText('confirm'))

  await wait(() => {
    expect(mockPatch).toHaveBeenCalledTimes(2)
  })

  const [url] = mockPatch.mock.calls[1]
  expect(url).toMatch(`/rooms/${room.id}/end`)
})

it('should be be disabled', async () => {
  const startUrl = 'http://zoom/start_url'

  const room = fakeRoom({
    is_online: false,
  })

  const {findByText, findByLabelText} = await goToRoomConfig({
    room,
    userPermissions: [START_ROOMS],
  })

  expect(await findByText(/end meeting/i)).toBeDisabled()

  const online: Room = {
    ...room,
    is_online: true,
  }

  mockPatch.mockImplementationOnce(() => Promise.resolve({data: online}))

  mockGet.mockImplementationOnce(() => Promise.resolve({data: {url: startUrl}}))

  user.click(await findByLabelText('toggle online'))

  expect(await findByText(/end meeting/i)).toBeDisabled()
})
