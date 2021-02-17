import App from 'App'
import {goToEvent} from 'organization/Event/__utils__/event'
import React from 'react'
import {render} from '__utils__/render'
import faker from 'faker'
import axios from 'axios'
import {fakeRoom} from 'organization/Event/AreaList/__utils__/factory'
import user from '@testing-library/user-event'
import {wait} from '@testing-library/react'

const mockGet = axios.get as jest.Mock

it('should open the returned url', async () => {
  const windowOpen = (global.open = jest.fn())

  const {event, areas} = goToEvent()

  const {findByLabelText} = render(<App />)

  const area = faker.random.arrayElement(areas)
  mockGet.mockImplementationOnce(() => Promise.resolve({data: area}))

  const room = fakeRoom({is_online: true})

  // Rooms
  mockGet.mockImplementationOnce(() => Promise.resolve({data: [room]}))
  // All Attendees
  mockGet.mockImplementationOnce(() => Promise.resolve({data: []}))
  // Area Attendees
  mockGet.mockImplementationOnce(() => Promise.resolve({data: []}))
  // Assignments
  mockGet.mockImplementationOnce(() => Promise.resolve({data: []}))

  user.click(await findByLabelText(`view ${event.name}`))
  // go to area config
  user.click(await findByLabelText(`view ${area.name} area`))

  const url = faker.internet.url()
  mockGet.mockImplementationOnce(() => Promise.resolve({data: {url}}))

  user.click(await findByLabelText('start room'))

  await wait(() => {
    expect(windowOpen).toHaveBeenCalledTimes(1)
  })

  const [startUrl] = mockGet.mock.calls[mockGet.mock.calls.length - 1]
  expect(startUrl).toMatch(
    `events/${event.slug}/areas/${area.id}/rooms/${room.id}/start_url`,
  )

  const [openUrl] = windowOpen.mock.calls[0]
  expect(openUrl).toBe(url)
})
