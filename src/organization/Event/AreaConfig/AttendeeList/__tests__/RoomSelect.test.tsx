import {goToEvent} from 'organization/Event/__utils__/event'
import user from '@testing-library/user-event'
import React from 'react'
import {render} from '__utils__/render'
import axios from 'axios'
import faker from 'faker'
import App from 'App'
import {fakeRoom} from 'organization/Event/AreaList/__utils__/factory'
import {Room} from 'Event/room'
import {fireEvent, wait} from '@testing-library/react'
import {fakeAttendee} from 'Event/auth/__utils__/factory'

const mockGet = axios.get as jest.Mock
const mockDelete = axios.delete as jest.Mock
const mockPost = axios.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should assign a room', async () => {
  const {event, areas} = goToEvent()

  const {findByLabelText, findAllByLabelText} = render(<App />)

  const area = faker.random.arrayElement(areas)
  mockGet.mockImplementationOnce(() => Promise.resolve({data: area}))

  const rooms = Array.from(
    {length: faker.random.number({min: 1, max: 3})},
    fakeRoom,
  )
  const attendees = Array.from(
    {length: faker.random.number({min: 1, max: 3})},
    fakeAttendee,
  )

  const targetIndex = faker.random.number({
    min: 0,
    max: attendees.length - 1,
  })
  const attendee = attendees[targetIndex]
  const room = faker.random.arrayElement(rooms)

  // Rooms
  mockGet.mockImplementationOnce(() => Promise.resolve({data: rooms}))
  // All Attendees
  mockGet.mockImplementationOnce(() => Promise.resolve({data: attendees}))
  // Area Attendees
  mockGet.mockImplementationOnce(() => Promise.resolve({data: attendees}))
  // Room Assignments - start with none assigned
  mockGet.mockImplementationOnce(() => Promise.resolve({data: []}))

  user.click(await findByLabelText(`view ${event.name}`))
  // go to area config
  user.click(await findByLabelText(`view ${area.name} area`))

  fireEvent.mouseDown((await findAllByLabelText('room select'))[targetIndex])

  mockPost.mockImplementationOnce(() => Promise.resolve({data: 'ok'}))

  user.click(await findByLabelText(`pick ${room.name}`))

  await wait(() => {
    expect(mockPost).toBeCalledTimes(1)
  })

  const [url] = mockPost.mock.calls[0]
  expect(url).toMatch(
    `/events/${event.slug}/areas/${area.id}/room_assignments/attendees/${attendee.id}/rooms/${room.id}`,
  )

  expect(
    ((await findAllByLabelText('room select'))[targetIndex] as HTMLDivElement)
      .textContent,
  ).toBe(room.name)
})

it('should unassign a room', async () => {
  const {event, areas} = goToEvent()

  const {findByLabelText} = render(<App />)

  const area = faker.random.arrayElement(areas)
  mockGet.mockImplementationOnce(() => Promise.resolve({data: area}))

  const rooms = Array.from(
    {length: faker.random.number({min: 1, max: 3})},
    fakeRoom,
  )

  const attendee = fakeAttendee()
  const room = faker.random.arrayElement(rooms)

  // Rooms
  mockGet.mockImplementationOnce(() => Promise.resolve({data: rooms}))
  // All Attendees
  mockGet.mockImplementationOnce(() => Promise.resolve({data: [attendee]}))
  // Area Attendees
  mockGet.mockImplementationOnce(() => Promise.resolve({data: [attendee]}))
  // Room Assignments - start assigned
  mockGet.mockImplementationOnce(() =>
    Promise.resolve({
      data: [
        {
          attendee,
          room,
        },
      ],
    }),
  )

  user.click(await findByLabelText(`view ${event.name}`))
  // go to area config
  user.click(await findByLabelText(`view ${area.name} area`))

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
  const {event, areas} = goToEvent()

  const {findByLabelText, findAllByLabelText} = render(<App />)

  const area = faker.random.arrayElement(areas)
  mockGet.mockImplementationOnce(() => Promise.resolve({data: area}))

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
  const room = rooms[roomIndex]
  const otherRooms = rooms.filter((_, index) => index !== roomIndex)
  const target = faker.random.arrayElement(otherRooms)

  // Rooms
  mockGet.mockImplementationOnce(() => Promise.resolve({data: rooms}))
  // All Attendees
  mockGet.mockImplementationOnce(() => Promise.resolve({data: attendees}))
  // Area Attendees
  mockGet.mockImplementationOnce(() => Promise.resolve({data: attendees}))
  // Room Assignments - start wiht assigned room
  mockGet.mockImplementationOnce(() =>
    Promise.resolve({data: [{attendee, room}]}),
  )

  user.click(await findByLabelText(`view ${event.name}`))
  // go to area config
  user.click(await findByLabelText(`view ${area.name} area`))

  fireEvent.mouseDown((await findAllByLabelText('room select'))[attendeeIndex])

  // Removes old room
  mockDelete.mockImplementationOnce(() => Promise.resolve({data: 'ok'}))
  // Assigns new one
  mockPost.mockImplementationOnce(() => Promise.resolve({data: 'ok'}))

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
