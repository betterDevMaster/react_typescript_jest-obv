import user from '@testing-library/user-event'
import axios from 'axios'
import faker from 'faker'
import {
  fakeArea,
  fakeRoom,
  fakeRoomMetrics,
} from 'organization/Event/AreaList/__utils__/factory'
import {wait} from '@testing-library/react'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {now} from 'lib/date-time'
import {Attendee} from 'Event/attendee'
import {CHECK_IN_ATTENDEES} from 'organization/PermissionsProvider'
import {goToArea} from 'organization/Event/AreaList/__utils__/go-to-areas'

const mockGet = axios.get as jest.Mock
const mockPatch = axios.patch as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should check in an attendee', async () => {
  const area = fakeArea({is_tech_check: true})

  const rooms = Array.from(
    {length: faker.random.number({min: 1, max: 3})},
    () => fakeRoom({max_num_attendees: null, is_online: true}),
  )
  const targetRoomIndex = faker.random.number({min: 0, max: rooms.length - 1})
  const targetRoom = rooms[targetRoomIndex]

  const {findByLabelText, findAllByLabelText} = await goToArea({
    userPermissions: [CHECK_IN_ATTENDEES],
    area,
    rooms,
  })

  // Start url
  const url = faker.internet.url()
  mockGet.mockImplementationOnce(() => Promise.resolve({data: {url}}))

  // Tech Check Assignments
  const numAssignments = faker.random.number({min: 2, max: 5})
  const assignments = Array.from({length: numAssignments}, () => {
    return {
      attendee: fakeAttendee(),
      room: targetRoom,
    }
  })

  mockGet.mockImplementationOnce(() => Promise.resolve({data: assignments}))

  mockGet.mockImplementationOnce(() =>
    Promise.resolve({data: fakeRoomMetrics({room_id: targetRoom.id})}),
  )

  // go to room config
  user.click(await findByLabelText(`view ${targetRoom.name} room`))

  expect((await findAllByLabelText('name')).length).toBe(assignments.length)

  // user click check in.
  const targetAttendeeIndex = faker.random.number({
    min: 0,
    max: assignments.length - 1,
  })
  const targetAttendee = assignments[targetAttendeeIndex]

  const today = now()
  const updated: Attendee = {
    ...targetAttendee.attendee,
    tech_check_completed_at: today,
  }

  mockPatch.mockImplementationOnce(() => Promise.resolve({data: updated}))
  user.click((await findAllByLabelText('check in button'))[targetAttendeeIndex])
  await wait(async () => {
    expect((await findAllByLabelText('name')).length).toBe(
      assignments.length - 1,
    )
  })
})
