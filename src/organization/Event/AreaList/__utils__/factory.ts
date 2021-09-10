import {Area} from 'organization/Event/AreasProvider'
import faker from 'faker'
import {Room} from 'Event/room'
import {RoomMetrics} from 'organization/Event/Area/RoomList'
import {now} from 'lib/date-time'

export const fakeRoom = (overrides?: Partial<Room>): Room => ({
  id: faker.random.number({min: 1000, max: 10000}),
  number: faker.random.number({min: 1000, max: 10000}),
  description: null,
  is_online: true,
  has_registration: false,
  registration_url: null,
  max_num_attendees: 500,
  ...overrides,
})

export const fakeArea = (overrides?: Partial<Area>): Area => ({
  id: faker.random.number({min: 1000, max: 10000}),
  name: faker.random.words(2),
  is_open: true,
  requires_approval: true,
  allows_multiple_devices: false,
  rooms: Array.from({length: faker.random.number({min: 1, max: 10})}, fakeRoom),
  is_tech_check: false,
  offline_title: null,
  offline_description: null,
  reassign_on_offline: false,
  key: faker.random.alphaNumeric(16),
  ...overrides,
})

export const fakeRoomMetrics = (
  overrides?: Partial<RoomMetrics>,
): RoomMetrics => ({
  room_id: faker.random.number({min: 1000, max: 10000}),
  num_attendees: String(faker.random.number({min: 1000, max: 10000})),
  last_joined_timestamp: now(),
  ...overrides,
})
