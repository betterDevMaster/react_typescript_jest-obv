import axios from 'axios'
import user from '@testing-library/user-event'
import {fakeEvent} from 'Event/__utils__/factory'
import {ObvioEvent} from 'Event'
import {signInToOrganization} from 'organization/__utils__/authenticate'
import {render} from '__utils__/render'
import App from 'App'
import React from 'react'
import {Permission} from 'organization/PermissionsProvider'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {of} from 'rxjs'

const mockGet = axios.get as jest.Mock
const mockRxPost = mockRxJsAjax.post as jest.Mock

export interface EventOverrides {
  event?: ObvioEvent
  userPermissions?: Permission[]
}

export function goToEvent(overrides: EventOverrides = {}) {
  const event = overrides.event || fakeEvent()

  const orgData = signInToOrganization({
    events: [event],
    userPermissions: overrides.userPermissions,
  })

  // Fetch target event
  mockGet.mockImplementationOnce(() => Promise.resolve({data: event}))

  return {event, ...orgData}
}

export async function goToEventConfig(overrides: EventOverrides = {}) {
  const data = goToEvent({...overrides})

  // Whenever template saved let's just return the given event by default
  mockRxPost.mockImplementation(() => of({response: data.event}))

  const renderResult = render(<App />)

  user.click(await renderResult.findByLabelText(`view ${data.event.name}`))

  return {...data, ...renderResult}
}
