import {Room} from 'Event/room'
import user from '@testing-library/user-event'
import {fakeArea, fakeRoom} from 'organization/Event/AreaList/__utils__/factory'
import {goToArea} from 'organization/Event/AreaList/__utils__/go-to-areas'
import {EventOverrides} from 'organization/Event/__utils__/event'
import axios from 'axios'
import {Area} from 'organization/Event/AreasProvider'
import {START_ROOMS} from 'organization/PermissionsProvider'

const mockGet = axios.get as jest.Mock

export async function goToRoomConfig(
  options: EventOverrides & {
    area?: Area
    room?: Room
    startUrl?: string
    hasJoinedUsers?: boolean
  } = {},
) {
  const room = options.room || fakeRoom()

  const area = options.area || fakeArea()

  const startUrl = options.startUrl || 'http://zoom/start_url'

  const context = await goToArea({
    ...options,
    area,
    rooms: [room],
  })

  if (room.is_online && context.userPermissions?.includes(START_ROOMS)) {
    mockGet.mockImplementationOnce(() =>
      Promise.resolve({data: {url: startUrl}}),
    )
  }

  const metrics = options.hasJoinedUsers
    ? {num_attendees: '5', last_joined_timestamp: '1643798432'}
    : {num_attendees: 0, last_joined_timestamp: '1643798432'}

  mockGet.mockImplementationOnce(() => Promise.resolve({data: metrics})) // metrics

  // go to room config
  user.click(await context.findByLabelText(`view ${room.number} room`))

  return {
    ...context,
    room,
  }
}
