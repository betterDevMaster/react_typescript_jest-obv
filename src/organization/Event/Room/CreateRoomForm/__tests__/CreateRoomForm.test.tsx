import faker from 'faker'
import user from '@testing-library/user-event'
import axios from 'axios'
import {fakeArea, fakeRoom} from 'organization/Event/AreaList/__utils__/factory'
import {wait} from '@testing-library/react'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {
  goToArea,
  goToAreas,
} from 'organization/Event/AreaList/__utils__/go-to-areas'

const mockGet = axios.get as jest.Mock
const mockPost = axios.post as jest.Mock

it('should create a room', async () => {
  const area = fakeArea()

  // Rooms
  const existingRooms = Array.from(
    {length: faker.random.number({min: 1, max: 3})},
    fakeRoom,
  )

  const {event, findByLabelText, findAllByLabelText} = await goToArea({
    userPermissions: [CONFIGURE_EVENTS],
    area,
    rooms: existingRooms,
  })

  user.click(await findByLabelText(`create rooms`))

  const numRooms = faker.random.number({min: 1, max: 10})

  const hasMaxNumAttendees = faker.random.boolean()
  const maxNumAttendees = faker.random.number({min: 100, max: 300})
  user.type(
    await findByLabelText('number of rooms to create'),
    String(numRooms),
  )

  if (hasMaxNumAttendees) {
    user.click(await findByLabelText('toggle has max num attendees'))
    user.type(
      await findByLabelText('set max number of attendees'),
      String(maxNumAttendees),
    )
  }

  for (let i = 0; i < numRooms; i++) {
    const room = fakeRoom({id: i + 1})
    // successfully create room
    mockPost.mockImplementationOnce(() => Promise.resolve({data: room}))
  }

  mockGet.mockImplementationOnce(() => Promise.resolve({data: []})) // metrics when back on area page

  user.click(await findByLabelText('create rooms'))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(numRooms)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/areas/${area.id}/rooms`)

  if (hasMaxNumAttendees) {
    expect(data.max_num_attendees).toBe(String(maxNumAttendees))
  } else {
    expect(data.max_num_attendees).toBeUndefined()
  }

  // Has new rooms - +1 because of another static label match
  expect((await findAllByLabelText('room')).length).toBe(
    numRooms + existingRooms.length,
  )
})

it('should allow retrying room', async () => {
  const area = fakeArea()
  const {
    areas,
    findByLabelText,
    findByText,
    findAllByLabelText,
  } = await goToArea({
    userPermissions: [CONFIGURE_EVENTS],
    area,
    rooms: [], // start with 0 rooms
  })

  user.click(await findByLabelText(`create rooms`))

  // Try create 2 rooms...
  user.type(await findByLabelText('number of rooms to create'), '2')

  // First one succeeds...
  mockPost.mockImplementationOnce(() => Promise.resolve({data: fakeRoom()}))
  // ... second one fails
  mockPost.mockImplementationOnce(() => Promise.reject('no good'))

  user.click(await findByLabelText('create rooms'))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(2)
  })

  expect(await findByText('1 out of 2 completed.'))

  user.click(await findByText(/retry/i))

  mockGet.mockImplementationOnce(() => Promise.resolve({data: []})) // metrics when back on area page
  user.click(await findByText(/cancel/i))

  // Is showing the 1 successful room
  expect((await findAllByLabelText('room')).length).toBe(1)
})
