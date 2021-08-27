import {Room} from 'Event/room'
import faker from 'faker'
import user from '@testing-library/user-event'
import {fakeArea, fakeRoom} from 'organization/Event/AreaList/__utils__/factory'
import {goToAreas} from 'organization/Event/AreaList/__utils__/go-to-areas'
import {EventOverrides} from 'organization/Event/__utils__/event'
import axios from 'axios'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'

const mockGet = axios.get as jest.Mock

export async function goToRoomConfig(
  options: EventOverrides & {
    room?: Room
  } = {},
) {
  const room = options.room || fakeRoom()

  const area = fakeArea()
  const context = await goToAreas({
    ...options,
    areas: [area],
  })

  // Get area
  mockGet.mockImplementationOnce(() => Promise.resolve({data: area}))

  // Rooms
  mockGet.mockImplementationOnce(() => Promise.resolve({data: [room]}))

  // go to area config
  user.click(await context.findByLabelText(`view ${area.name} area`))

  // Room to be configured
  mockGet.mockImplementationOnce(() => Promise.resolve({data: room}))

  // go to room config
  user.click(await context.findByLabelText(`view ${room.name} room`))

  return {
    ...context,
    room,
  }
}
