import React from 'react'
import user from '@testing-library/user-event'
import faker from 'faker'
import {EventOverrides, goToEvent} from 'organization/Event/__utils__/event'
import {render} from '__utils__/render'
import App from 'App'
import axios from 'axios'
import {fakeAction} from 'Event/ActionsProvider/__utils__/factory'
import {Action} from 'Event/ActionsProvider'
import {wait} from '@testing-library/react'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'

const mockGet = axios.get as jest.Mock

export async function goToPointsConfig(
  overrides: {actions?: Action[]} & EventOverrides = {},
) {
  const userPermissions = overrides.userPermissions || [CONFIGURE_EVENTS]

  const {event} = goToEvent({...overrides, userPermissions})
  const {findByLabelText, ...renderResult} = render(<App />)

  user.click(await findByLabelText(`view ${event.name}`))

  // Custom actions
  const actions =
    overrides.actions ||
    Array.from({length: faker.random.number({min: 2, max: 4})}, () =>
      fakeAction(),
    )
  mockGet.mockImplementationOnce(() => Promise.resolve({data: actions}))

  // go to area config
  user.click(await findByLabelText(`configure points`))

  await wait(() => {
    expect(mockGet).toHaveBeenCalledTimes(8)
  })

  return {
    event,
    findByLabelText,
    ...renderResult,
    actions,
  }
}
