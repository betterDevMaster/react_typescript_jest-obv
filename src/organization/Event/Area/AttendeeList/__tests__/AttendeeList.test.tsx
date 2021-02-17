import {goToEvent} from 'organization/Event/__utils__/event'
import user from '@testing-library/user-event'
import React from 'react'
import {render} from '__utils__/render'
import axios from 'axios'
import faker from 'faker'
import App from 'App'
import {fakeRoom} from 'organization/Event/AreaList/__utils__/factory'
import {wait} from '@testing-library/react'
import {fakeAttendee} from 'Event/auth/__utils__/factory'

const mockGet = axios.get as jest.Mock
const mockDelete = axios.delete as jest.Mock
const mockPost = axios.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should render attendee list', async () => {
  const {event, areas} = goToEvent()

  const {findByLabelText, findAllByLabelText} = render(<App />)

  const area = faker.random.arrayElement(areas)
  mockGet.mockImplementationOnce(() => Promise.resolve({data: area}))

  const rooms = Array.from(
    {length: faker.random.number({min: 1, max: 3})},
    fakeRoom,
  )
  const allAttendees = Array.from(
    {length: faker.random.number({min: 2, max: 3})},
    fakeAttendee,
  )
  const numAttendees = faker.random.number({min: 1, max: allAttendees.length})
  const areaAttendees = allAttendees.slice(0, numAttendees)

  const targetIndex = faker.random.number({
    min: 0,
    max: areaAttendees.length - 1,
  })
  const attendee = areaAttendees[targetIndex]
  const room = faker.random.arrayElement(rooms)

  const assignments = [{attendee, room}]

  // Rooms
  mockGet.mockImplementationOnce(() => Promise.resolve({data: rooms}))
  // All Attendees
  mockGet.mockImplementationOnce(() => Promise.resolve({data: allAttendees}))
  // Room Assignments
  mockGet.mockImplementationOnce(() => Promise.resolve({data: assignments}))
  // Area Attendees
  mockGet.mockImplementationOnce(() => Promise.resolve({data: areaAttendees}))

  user.click(await findByLabelText(`view ${event.name}`))
  // go to area config
  user.click(await findByLabelText(`view ${area.name} area`))

  expect((await findAllByLabelText('attendee')).length).toBe(
    allAttendees.length,
  )

  // Has assigned room pre-selected
  expect(
    ((await findAllByLabelText('room select'))[targetIndex] as HTMLDivElement)
      .textContent,
  ).toBe(room.name)
})

it('should update attendee entry', async () => {
  const {event, areas} = goToEvent()

  const {findByLabelText, findAllByLabelText} = render(<App />)

  const area = faker.random.arrayElement(areas)
  mockGet.mockImplementationOnce(() => Promise.resolve({data: area}))

  const rooms = Array.from(
    {length: faker.random.number({min: 1, max: 3})},
    fakeRoom,
  )
  const allAttendees = Array.from(
    {length: faker.random.number({min: 1, max: 3})},
    fakeAttendee,
  )
  const numAttendees = faker.random.number({min: 1, max: allAttendees.length})
  const areaAttendees = allAttendees.slice(0, numAttendees)

  const targetIndex = faker.random.number({
    min: 0,
    max: areaAttendees.length - 1,
  })
  const attendee = areaAttendees[targetIndex]
  const room = faker.random.arrayElement(rooms)

  const assignments = [{attendee, room}]

  // Rooms
  mockGet.mockImplementationOnce(() => Promise.resolve({data: rooms}))
  // All Attendees
  mockGet.mockImplementationOnce(() => Promise.resolve({data: allAttendees}))
  // Room Assignments
  mockGet.mockImplementationOnce(() => Promise.resolve({data: assignments}))
  // Area Attendees
  mockGet.mockImplementationOnce(() => Promise.resolve({data: areaAttendees}))

  user.click(await findByLabelText(`view ${event.name}`))
  // go to area config
  user.click(await findByLabelText(`view ${area.name} area`))

  // Is originally added to area
  expect(
    ((await findAllByLabelText('toggle entry'))[
      targetIndex
    ] as HTMLInputElement).checked,
  ).toBe(true)

  mockDelete.mockImplementationOnce(() => Promise.resolve({data: 'ok'}))

  user.click((await findAllByLabelText('toggle entry'))[targetIndex])

  await wait(() => {
    expect(mockDelete).toBeCalledTimes(1)
  })

  const [removeUrl] = mockDelete.mock.calls[0]
  expect(removeUrl).toMatch(
    `events/${event.slug}/areas/${area.id}/attendees/${attendee.id}`,
  )

  // Is unchecked
  expect(
    ((await findAllByLabelText('toggle entry'))[
      targetIndex
    ] as HTMLInputElement).checked,
  ).toBe(false)

  mockPost.mockImplementationOnce(() => Promise.resolve({data: 'ok'}))

  user.click((await findAllByLabelText('toggle entry'))[targetIndex])

  await wait(() => {
    expect(mockPost).toBeCalledTimes(1)
  })

  const [addUrl] = mockPost.mock.calls[0]
  expect(addUrl).toMatch(
    `events/${event.slug}/areas/${area.id}/attendees/${attendee.id}`,
  )

  // Is Checked
  expect(
    ((await findAllByLabelText('toggle entry'))[
      targetIndex
    ] as HTMLInputElement).checked,
  ).toBe(true)
})
