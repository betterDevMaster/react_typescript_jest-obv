import {
  EventOverrides,
  goToEventConfig,
} from 'organization/Event/__utils__/event'
import faker from 'faker'
import user from '@testing-library/user-event'
import {
  fakeArea,
  fakeRoom,
  fakeRoomMetrics,
} from 'organization/Event/AreaList/__utils__/factory'
import {Area} from 'organization/Event/AreasProvider'
import axios from 'axios'
import {Room} from 'Event/room'
import {RoomMetrics} from 'organization/Event/Area/RoomList'

const mockGet = axios.get as jest.Mock

export async function goToAreas(
  overrides: EventOverrides & {areas?: Area[]} = {},
) {
  const areas =
    overrides.areas ||
    Array.from({length: faker.random.number({min: 1, max: 5})}, fakeArea)

  const context = await goToEventConfig(overrides)

  mockGet.mockImplementationOnce(() => Promise.resolve({data: areas}))

  /**
   * Fetch metrics per area
   */

  for (const _ of areas) {
    mockGet.mockImplementationOnce(() => Promise.resolve({data: []}))
  }

  user.click(await context.findByLabelText('areas'))

  return {...context, areas}
}

export async function goToArea(
  overrides: EventOverrides & {area?: Area; rooms?: Room[]} = {},
) {
  const area = overrides.area || fakeArea()

  const context = await goToAreas({areas: [area], ...overrides})

  const rooms = overrides.rooms || []
  const roomMetrics: RoomMetrics[] = rooms.map((r) =>
    fakeRoomMetrics({room_id: r.id}),
  )

  mockGet.mockImplementationOnce(() => Promise.resolve({data: area}))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: rooms}))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: roomMetrics}))

  user.click(await context.findByLabelText(`view ${area.name} area`))

  return {...context, area, rooms}
}
