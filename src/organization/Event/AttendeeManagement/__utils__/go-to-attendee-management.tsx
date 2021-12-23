import React from 'react'
import faker from 'faker'
import {render} from '__utils__/render'
import user from '@testing-library/user-event'
import axios from 'axios'
import App from 'App'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {Attendee} from 'Event/attendee'
import {EventOverrides, goToEvent} from 'organization/Event/__utils__/event'
import {fakeArea} from 'organization/Event/AreaList/__utils__/factory'
import {Area} from 'organization/Event/AreasProvider'
import {fakePaginate} from 'lib/__utils__/pagination-factory'
import {UPDATE_ATTENDEES} from 'organization/PermissionsProvider'

const mockGet = axios.get as jest.Mock

export async function goToAttendeeManagement(
  overrides: {
    attendees?: Attendee[]
    areas?: Area[]
    mockInitialGet?: () => void
  } & EventOverrides = {},
) {
  const areas =
    overrides.areas ||
    Array.from({length: faker.random.number({min: 1, max: 5})}, fakeArea)

  const userPermissions = overrides.userPermissions || [UPDATE_ATTENDEES]

  const data = goToEvent({...overrides, userPermissions})

  const renderResult = render(<App />)

  user.click(await renderResult.findByLabelText(`view ${data.event.name}`))

  // areas
  mockGet.mockImplementationOnce(() => Promise.resolve({data: areas}))

  // If we're overriding the initial load get request, we'll
  // skip the mock
  if (overrides.mockInitialGet) {
    overrides.mockInitialGet()
  } else {
    const attendees =
      overrides.attendees ||
      Array.from({length: faker.random.number({min: 1, max: 5})}, fakeAttendee)

    mockGet.mockImplementationOnce(() =>
      Promise.resolve({data: fakePaginate({data: attendees})}),
    )
  }

  user.click(await renderResult.findByLabelText('attendee management'))

  return {...data, ...renderResult}
}
