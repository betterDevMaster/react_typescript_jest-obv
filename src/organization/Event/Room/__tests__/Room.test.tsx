import user from '@testing-library/user-event'
import axios from 'axios'
import faker from 'faker'
import {fakeArea, fakeRoom} from 'organization/Event/AreaList/__utils__/factory'
import {Room} from 'Event/room'
import {wait} from '@testing-library/react'
import {CONFIGURE_EVENTS, START_ROOMS} from 'organization/PermissionsProvider'
import {goToArea} from 'organization/Event/AreaList/__utils__/go-to-areas'

const mockGet = axios.get as jest.Mock
const mockPatch = axios.patch as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

Object.assign(navigator, {
  clipboard: {
    writeText: () => Promise.resolve(),
  },
})

it('should toggle a room on/off', async () => {
  const rooms = Array.from(
    {length: faker.random.number({min: 1, max: 3})},
    fakeRoom,
  )
  const targetIndex = faker.random.number({min: 0, max: rooms.length - 1})
  const target = rooms[targetIndex]

  const {findByLabelText} = await goToArea({
    userPermissions: [START_ROOMS],
    rooms,
  })

  // Start url
  const url = faker.internet.url()
  mockGet.mockImplementationOnce(() => Promise.resolve({data: {url}}))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: []})) // metrics

  // go to room config
  user.click(await findByLabelText(`view ${target.number} room`))

  expect(
    ((await findByLabelText('toggle online')) as HTMLInputElement).checked,
  ).toBe(target.is_online)

  expect(await findByLabelText('start room')).not.toBeDisabled()

  const updated: Room = {
    ...target,
    is_online: !target.is_online,
  }
  mockPatch.mockImplementationOnce(() => Promise.resolve({data: updated}))

  user.click(await findByLabelText('toggle online'))

  await wait(() => {
    expect(mockPatch).toHaveBeenCalledTimes(1)
  })

  const [updateUrl] = mockPatch.mock.calls[0]

  const endpoint = target.is_online ? 'stop' : 'start'
  expect(updateUrl).toMatch(`/rooms/${target.id}/${endpoint}`)

  expect(await findByLabelText('start room')).toBeDisabled()
})

it('should update room attributes', async () => {
  const area = fakeArea({
    is_tech_check: false,
  })

  const rooms = Array.from(
    {length: faker.random.number({min: 1, max: 3})},
    () => fakeRoom({max_num_attendees: null, is_online: false}),
  )
  const targetIndex = faker.random.number({min: 0, max: rooms.length - 1})
  const target = rooms[targetIndex]

  const {findByLabelText} = await goToArea({
    userPermissions: [START_ROOMS, CONFIGURE_EVENTS],
    area,
    rooms,
  })

  mockGet.mockImplementationOnce(() =>
    Promise.resolve({data: {url: 'http://starturl.zoom'}}),
  )
  mockGet.mockImplementationOnce(() => Promise.resolve({data: []})) // metrics

  // go to room config
  user.click(await findByLabelText(`view ${target.number} room`))

  const newDescription = faker.random.word()

  const hasMaxAttendees = faker.random.boolean()
  const maxNumAttendees = faker.random.number({min: 100, max: 400})

  user.type(await findByLabelText('room description'), newDescription)

  if (hasMaxAttendees) {
    user.click(await findByLabelText('toggle has max num attendees'))
    user.type(
      await findByLabelText('set max number of attendees'),
      String(maxNumAttendees),
    )
  }

  const updated: Room = {
    ...target,
    description: newDescription,
    max_num_attendees: hasMaxAttendees ? null : maxNumAttendees,
  }
  mockPatch.mockImplementationOnce(() => Promise.resolve({data: updated}))

  user.click(await findByLabelText('update room'))

  await wait(() => {
    expect(mockPatch).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPatch.mock.calls[0]

  expect(url).toMatch(`/rooms/${target.id}`)

  expect(data.description).toBe(newDescription)

  if (hasMaxAttendees) {
    expect(data.max_num_attendees).toBe(maxNumAttendees)
  }
})
