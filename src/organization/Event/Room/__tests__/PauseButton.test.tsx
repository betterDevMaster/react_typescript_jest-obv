import {fakeArea, fakeRoom} from 'organization/Event/AreaList/__utils__/factory'
import user from '@testing-library/user-event'
import {goToRoomConfig} from 'organization/Event/Room/__utils__/go-to-room-config'
import {START_ROOMS} from 'organization/PermissionsProvider'
import axios from 'axios'
import {Room} from 'Event/room'
import {wait} from '@testing-library/dom'

const mockPatch = axios.patch as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should pause a room', async () => {
  const area = fakeArea({
    is_tech_check: true,
  })

  const room = fakeRoom({
    is_online: true,
    is_paused: false,
  })

  const {findByText} = await goToRoomConfig({
    area,
    room,
    userPermissions: [START_ROOMS],
    hasJoinedUsers: true,
  })

  expect(await findByText(/pause room/i)).not.toBeDisabled()

  mockPatch.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        ...room,
        is_paused: true,
      },
    }),
  )

  user.click(await findByText('Pause Room'))

  await wait(() => {
    expect(mockPatch).toHaveBeenCalledTimes(1)
  })

  const [pauseUrl] = mockPatch.mock.calls[0]
  expect(pauseUrl).toMatch(`/rooms/${room.id}/pause`)

  expect(await findByText(/unpause room/i)).not.toBeDisabled()

  mockPatch.mockImplementationOnce(() => Promise.resolve({data: room}))

  user.click(await findByText(/unpause room/i))

  await wait(() => {
    expect(mockPatch).toHaveBeenCalledTimes(2)
  })

  const [unpauseUrl] = mockPatch.mock.calls[1]
  expect(unpauseUrl).toMatch(`/rooms/${room.id}/unpause`)
})
