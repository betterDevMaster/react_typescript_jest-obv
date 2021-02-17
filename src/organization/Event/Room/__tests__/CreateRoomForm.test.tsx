import React from 'react'
import faker from 'faker'
import user from '@testing-library/user-event'
import {goToEvent} from 'organization/Event/__utils__/event'
import {render} from '__utils__/render'
import App from 'App'
import axios from 'axios'
import {fakeRoom} from 'organization/Event/AreaList/__utils__/factory'
import {findAllByLabelText, wait} from '@testing-library/react'
import RoomSelect from 'organization/Event/Area/AttendeeList/RoomSelect'

const mockGet = axios.get as jest.Mock
const mockPost = axios.post as jest.Mock

it('should create a room', async () => {
  const {event, areas} = goToEvent()
  const {findByLabelText, findAllByLabelText} = render(<App />)

  const area = faker.random.arrayElement(areas)
  mockGet.mockImplementationOnce(() => Promise.resolve({data: area}))

  // Rooms
  const rooms = Array.from(
    {length: faker.random.number({min: 1, max: 3})},
    fakeRoom,
  )
  mockGet.mockImplementationOnce(() => Promise.resolve({data: rooms}))

  user.click(await findByLabelText(`view ${event.name}`))
  user.click(await findByLabelText(`view ${area.name} area`))
  user.click(await findByLabelText(`create room`))

  const name = faker.random.word()
  const hasMaxNumAttendees = faker.random.boolean()
  const maxNumAttendees = faker.random.number({min: 100, max: 300})
  user.type(await findByLabelText('room name input'), name)

  if (hasMaxNumAttendees) {
    user.click(await findByLabelText('toggle has max num attendees'))
    user.type(
      await findByLabelText('set max number of attendees'),
      String(maxNumAttendees),
    )
  }

  const room = fakeRoom()
  // successfully create room
  mockPost.mockImplementationOnce(() => Promise.resolve({data: room}))
  // Fetched room for config
  const withNewRoom = [...rooms, room]
  mockGet.mockImplementationOnce(() => Promise.resolve({data: withNewRoom}))

  user.click(await findByLabelText('create room'))

  // Has new room
  expect((await findAllByLabelText('room')).length).toBe(rooms.length + 1)
})
