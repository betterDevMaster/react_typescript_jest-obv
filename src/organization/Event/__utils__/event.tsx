import axios from 'axios'
import user from '@testing-library/user-event'
import {fakeEvent} from 'Event/__utils__/factory'
import {ObvioEvent} from 'Event'
import {
  signInToOrganization,
  SignInToOrganizationOptions,
} from 'organization/__utils__/authenticate'
import {render} from '__utils__/render'
import App from 'App'
import React from 'react'
import {Permission} from 'organization/PermissionsProvider'

const mockGet = axios.get as jest.Mock

export interface EventOverrides extends SignInToOrganizationOptions {
  event?: ObvioEvent
  userPermissions?: Permission[]
}

export function goToEvent(
  overrides: SignInToOrganizationOptions & EventOverrides = {},
) {
  const event = overrides.event || fakeEvent()
  // const authUser = overrides.authUser || null

  const userPermissions = overrides.userPermissions

  const orgData = signInToOrganization({
    events: [event],
    userPermissions,
    ...overrides,
  })

  // Fetch target event
  mockGet.mockImplementationOnce(() => Promise.resolve({data: event}))

  return {event, userPermissions, ...orgData}
}

export async function goToEventConfig(
  overrides: SignInToOrganizationOptions & EventOverrides = {},
) {
  const data = goToEvent({...overrides})

  const renderResult = render(<App />)

  user.click(await renderResult.findByLabelText(`view ${data.event.name}`))

  return {...data, ...renderResult}
}
