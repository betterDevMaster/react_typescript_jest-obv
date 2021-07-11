import user from '@testing-library/user-event'
import axios from 'axios'
import faker from 'faker'
import {fakeArea, fakeRoom} from 'organization/Event/AreaList/__utils__/factory'
import {Room} from 'Event/room'
import {wait} from '@testing-library/react'
import {CONFIGURE_EVENTS, START_ROOMS} from 'organization/PermissionsProvider'
import {goToAreas} from 'organization/Event/AreaList/__utils__/go-to-areas'

const mockGet = axios.get as jest.Mock
const mockPatch = axios.patch as jest.Mock
const mockDelete = axios.delete as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

Object.assign(navigator, {
  clipboard: {
    writeText: () => Promise.resolve(),
  },
})

it('should toggle a room on/off', async () => {
  const {findByLabelText, areas} = await goToAreas({
    userPermissions: [START_ROOMS],
  })

  const area = faker.random.arrayElement(areas)
  mockGet.mockImplementationOnce(() => Promise.resolve({data: area}))

  const rooms = Array.from(
    {length: faker.random.number({min: 1, max: 3})},
    fakeRoom,
  )
  const targetIndex = faker.random.number({min: 0, max: rooms.length - 1})
  const target = rooms[targetIndex]

  // Rooms
  mockGet.mockImplementationOnce(() => Promise.resolve({data: rooms}))

  // go to area config
  user.click(await findByLabelText(`view ${area.name} area`))

  // Room to be configured
  mockGet.mockImplementationOnce(() => Promise.resolve({data: target}))
  // Start url
  const url = faker.internet.url()
  mockGet.mockImplementationOnce(() => Promise.resolve({data: {url}}))

  // go to room config
  user.click(await findByLabelText(`view ${target.name} room`))

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
  const {findByLabelText} = await goToAreas({
    userPermissions: [START_ROOMS, CONFIGURE_EVENTS],
    areas: [area],
  })

  mockGet.mockImplementationOnce(() => Promise.resolve({data: area}))

  const rooms = Array.from(
    {length: faker.random.number({min: 1, max: 3})},
    () => fakeRoom({max_num_attendees: null, is_online: false}),
  )
  const targetIndex = faker.random.number({min: 0, max: rooms.length - 1})
  const target = rooms[targetIndex]

  // Rooms
  mockGet.mockImplementationOnce(() => Promise.resolve({data: rooms}))

  // go to area config
  user.click(await findByLabelText(`view ${area.name} area`))

  // Room to be configured
  mockGet.mockImplementationOnce(() => Promise.resolve({data: target}))

  // go to room config
  user.click(await findByLabelText(`view ${target.name} room`))

  const newName = faker.random.word()

  const hasMaxAttendees = faker.random.boolean()
  const maxNumAttendees = faker.random.number({min: 100, max: 400})

  user.type(await findByLabelText('room name input'), newName)

  if (hasMaxAttendees) {
    user.click(await findByLabelText('toggle has max num attendees'))
    user.type(
      await findByLabelText('set max number of attendees'),
      String(maxNumAttendees),
    )
  }

  const updated: Room = {
    ...target,
    name: newName,
    max_num_attendees: hasMaxAttendees ? null : maxNumAttendees,
  }
  mockPatch.mockImplementationOnce(() => Promise.resolve({data: updated}))

  user.click(await findByLabelText('update room'))

  await wait(() => {
    expect(mockPatch).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPatch.mock.calls[0]

  expect(url).toMatch(`/rooms/${target.id}`)

  expect(data.name).toBe(newName)

  if (hasMaxAttendees) {
    expect(data.max_num_attendees).toBe(maxNumAttendees)
  }
})

it('should configure room registration', async () => {
  const area = fakeArea({
    is_tech_check: false,
  })

  const {findByLabelText, queryByLabelText} = await goToAreas({
    areas: [area],
    userPermissions: [CONFIGURE_EVENTS, START_ROOMS],
  })

  mockGet.mockImplementationOnce(() => Promise.resolve({data: area}))

  const room = fakeRoom({
    has_registration: false,
    is_online: false,
  })
  mockGet.mockImplementationOnce(() => Promise.resolve({data: [room]}))

  // Go to area
  user.click(await findByLabelText(`view ${area.name} area`))

  // Go to room
  mockGet.mockImplementationOnce(() => Promise.resolve({data: room}))
  user.click(await findByLabelText(`view ${room.name} room`))

  expect(await findByLabelText('room name input')).toBeInTheDocument()

  expect(
    ((await findByLabelText('toggle registration')) as HTMLInputElement)
      .checked,
  ).toBe(room.has_registration)

  const registrationUrl = faker.internet.url()

  const enabled: Room = {
    ...room,
    has_registration: true,
    registration_url: registrationUrl,
  }
  mockPatch.mockImplementationOnce(() => Promise.resolve({data: enabled}))

  //  Enable registration
  user.click(await findByLabelText('toggle registration'))

  const [patchUrl] = mockPatch.mock.calls[0]
  expect(patchUrl).toMatch(`/rooms/${room.id}/registration`)

  //copy an access token
  jest.spyOn(navigator.clipboard, 'writeText')
  user.click(await findByLabelText('copy registration url'))
  await wait(() => {
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(registrationUrl)
  })

  const disabled: Room = {
    ...room,
    has_registration: false,
    registration_url: null,
  }
  mockDelete.mockImplementationOnce(() => Promise.resolve({data: disabled}))

  // Disable registration
  user.click(await findByLabelText('toggle registration'))

  await wait(async () => {
    expect(mockDelete).toHaveBeenCalledTimes(1)
    expect(queryByLabelText('copy registration url'))
  })

  const [deleteUrl] = mockDelete.mock.calls[0]
  expect(deleteUrl).toMatch(`/rooms/${room.id}/registration`)
})
