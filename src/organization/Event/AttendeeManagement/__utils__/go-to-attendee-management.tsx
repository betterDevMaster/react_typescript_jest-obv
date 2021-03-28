import React from 'react'
import faker from 'faker'
import {render} from '__utils__/render'
import user from '@testing-library/user-event'
import axios from 'axios'
import App from 'App'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {Attendee} from 'Event/attendee'
import {EventOverrides, goToEvent} from 'organization/Event/__utils__/event'
import {RoomAssignment} from 'organization/Event/RoomAssignmentsProvider'
import {fakeArea} from 'organization/Event/AreaList/__utils__/factory'

const mockGet = axios.get as jest.Mock

export async function goToAttendeeManagement(
  overrides: {
    attendees?: Attendee[]
    roomAssignments?: RoomAssignment[]
  } & EventOverrides = {},
) {
  const areas =
    overrides.areas ||
    Array.from({length: faker.random.number({min: 1, max: 5})}, fakeArea)

  const data = goToEvent({...overrides, areas})

  // areas
  mockGet.mockImplementationOnce(() => Promise.resolve({data: areas}))

  const attendees =
    overrides.attendees ||
    Array.from({length: faker.random.number({min: 1, max: 5})}, fakeAttendee)
  mockGet.mockImplementationOnce(() => Promise.resolve({data: attendees}))

  const roomAssignments = overrides.roomAssignments || []
  // We fetch assignments per area, but for tests we'll just accept all
  // the assignments we care about
  for (const _ of data.areas) {
    mockGet.mockImplementationOnce(() =>
      Promise.resolve({data: roomAssignments}),
    )
  }

  const renderResult = render(<App />)

  user.click(await renderResult.findByLabelText(`view ${data.event.name}`))

  // Wait for areas to finish loading or we run into hash
  // change error
  expect(
    await renderResult.findByLabelText(`view ${data.areas[0].name} area`),
  ).toBeInTheDocument()

  user.click(await renderResult.findByLabelText('attendee management'))

  // Wait for attendees to load
  for (const attendee of attendees) {
    expect(await renderResult.findByText(attendee.email)).toBeInTheDocument()
  }
  return {...data, ...renderResult}
}
