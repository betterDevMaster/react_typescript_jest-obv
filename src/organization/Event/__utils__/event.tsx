import axios from 'axios'
import user from '@testing-library/user-event'
import {fakeEvent} from 'Event/__utils__/factory'
import {ObvioEvent} from 'Event'
import {signInToOrganization} from 'organization/__utils__/authenticate'
import faker from 'faker'
import {fakeArea} from 'organization/Event/AreaList/__utils__/factory'
import {Area} from 'organization/Event/AreasProvider'
import {render} from '__utils__/render'
import App from 'App'
import React from 'react'
import {Permission} from 'organization/PermissionsProvider'

const mockGet = axios.get as jest.Mock

export interface EventOverrides {
  event?: ObvioEvent
  areas?: Area[]
  userPermissions?: Permission[]
}

export function goToEvent(overrides: EventOverrides = {}) {
  const event = overrides.event || fakeEvent()
  const areas =
    overrides.areas ||
    Array.from({length: faker.random.number({min: 1, max: 5})}, fakeArea)

  const orgData = signInToOrganization({
    events: [event],
    userPermissions: overrides.userPermissions,
  })

  // Fetch target event
  mockGet.mockImplementationOnce(() => Promise.resolve({data: event}))
  // areas
  mockGet.mockImplementationOnce(() => Promise.resolve({data: areas}))

  return {event, areas, ...orgData}
}

export async function goToEventConfig(overrides: EventOverrides = {}) {
  const areas =
    overrides.areas ||
    Array.from({length: faker.random.number({min: 1, max: 5})}, fakeArea)

  const data = goToEvent({...overrides, areas})
  const renderResult = render(<App />)

  user.click(await renderResult.findByLabelText(`view ${data.event.name}`))

  // Wait for areas to finish loading or we run into hash
  // change error
  expect(
    await renderResult.findByLabelText(`view ${areas[0].name} area`),
  ).toBeInTheDocument()

  return {...data, ...renderResult}
}
