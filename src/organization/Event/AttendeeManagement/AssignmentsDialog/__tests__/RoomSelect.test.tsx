import user from '@testing-library/user-event'
import axios from 'axios'
import faker from 'faker'
import {fakeArea, fakeRoom} from 'organization/Event/AreaList/__utils__/factory'
import {fireEvent, wait} from '@testing-library/react'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {goToAttendeeManagement} from 'organization/Event/AttendeeManagement/__utils__/go-to-attendee-management'

const mockGet = axios.get as jest.Mock
const mockDelete = axios.delete as jest.Mock
const mockPost = axios.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should assign a room', async () => {
  const rooms = Array.from(
    {length: faker.random.number({min: 1, max: 3})},
    fakeRoom,
  )
  const area = fakeArea({rooms})

  const attendees = Array.from(
    {length: faker.random.number({min: 1, max: 3})},
    fakeAttendee,
  )

  const targetIndex = faker.random.number({
    min: 0,
    max: attendees.length - 1,
  })
  const target = attendees[targetIndex]
  const attendee = attendees[targetIndex]
  const room = faker.random.arrayElement(rooms)

  const {findAllByLabelText, findByLabelText, event} =
    await goToAttendeeManagement({
      attendees,
      areas: [area],
    })

  // Room assignments
  mockGet.mockImplementationOnce(() => Promise.resolve({data: []}))

  user.click((await findAllByLabelText('view room assignments'))[targetIndex])

  fireEvent.mouseDown(await findByLabelText('room select'))

  mockPost.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        area_id: area.id,
        room_id: room.id,
        attendee_id: target.id,
      },
    }),
  )

  user.click(await findByLabelText(`pick ${room.name}`))

  await wait(() => {
    expect(mockPost).toBeCalledTimes(1)
  })

  const [url] = mockPost.mock.calls[0]
  expect(url).toMatch(
    `/events/${event.slug}/areas/${area.id}/room_assignments/attendees/${attendee.id}/rooms/${room.id}`,
  )

  expect(
    ((await findByLabelText('room select')) as HTMLDivElement).textContent,
  ).toBe(room.name)
})

it('should unassign a room', async () => {
  const rooms = Array.from(
    {length: faker.random.number({min: 1, max: 3})},
    fakeRoom,
  )
  const area = fakeArea({rooms})
  const attendee = fakeAttendee()
  const room = faker.random.arrayElement(rooms)

  const {findByLabelText, event} = await goToAttendeeManagement({
    attendees: [attendee],
    areas: [area],
  })

  // Room assignments
  mockGet.mockImplementationOnce(() =>
    Promise.resolve({
      data: [
        {
          attendee_id: attendee.id,
          area_id: area.id,
          room_id: room.id,
        },
      ],
    }),
  )

  user.click(await findByLabelText('view room assignments'))

  fireEvent.mouseDown(await findByLabelText('room select'))

  mockDelete.mockImplementationOnce(() => Promise.resolve({data: 'ok'}))

  user.click(await findByLabelText('unassign room'))

  await wait(() => {
    expect(mockDelete).toBeCalledTimes(1)
  })

  const [url] = mockDelete.mock.calls[0]
  expect(url).toMatch(
    `/events/${event.slug}/areas/${area.id}/room_assignments/attendees/${attendee.id}`,
  )

  expect(
    ((await findByLabelText('room select')) as HTMLDivElement).textContent,
  ).toBe('Not Assigned')
})

it('it should re-assign a room', async () => {
  const rooms = Array.from(
    {length: faker.random.number({min: 2, max: 3})},
    fakeRoom,
  )

  const attendees = Array.from(
    {length: faker.random.number({min: 1, max: 3})},
    fakeAttendee,
  )
  const attendeeIndex = faker.random.number({
    min: 0,
    max: attendees.length - 1,
  })

  const attendee = attendees[attendeeIndex]

  const roomIndex = faker.random.number({min: 0, max: rooms.length - 1})
  const originalRoom = rooms[roomIndex]
  const otherRooms = rooms.filter((_, index) => index !== roomIndex)
  const target = faker.random.arrayElement(otherRooms)

  const area = fakeArea({rooms})

  const {findByLabelText, event, findAllByLabelText} =
    await goToAttendeeManagement({
      attendees,
      areas: [area],
    })

  // Room assignments
  mockGet.mockImplementationOnce(() =>
    Promise.resolve({
      data: [
        {
          room_id: originalRoom.id,
          attendee_id: attendee.id,
          area_id: area.id,
        },
      ],
    }),
  )

  user.click((await findAllByLabelText('view room assignments'))[attendeeIndex])

  fireEvent.mouseDown(await findByLabelText('room select'))

  // Removes old room
  mockDelete.mockImplementationOnce(() => Promise.resolve({data: 'ok'}))
  // Assigns new one
  mockPost.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        room_id: target.id,
        attendee_id: attendee.id,
        area_id: area.id,
      },
    }),
  )

  user.click(await findByLabelText(`pick ${target.name}`))

  await wait(() => {
    expect(mockDelete).toBeCalledTimes(1)
    expect(mockPost).toBeCalledTimes(1)
  })

  const [deleteUrl] = mockPost.mock.calls[0]
  expect(deleteUrl).toMatch(
    `/events/${event.slug}/areas/${area.id}/room_assignments/attendees/${attendee.id}`,
  )

  const [addUrl] = mockPost.mock.calls[0]
  expect(addUrl).toMatch(
    `/events/${event.slug}/areas/${area.id}/room_assignments/attendees/${attendee.id}/rooms/${target.id}`,
  )
})
