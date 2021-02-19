import {ObvioEvent} from 'Event'
import {fakeEvent} from 'Event/__utils__/factory'
import axios from 'axios'
import {signInToOrganization} from 'organization/__utils__/authenticate'
import {render} from '__utils__/render'
import App from 'App'
import React from 'react'
import user from '@testing-library/user-event'
import {fakeAction} from 'Event/ActionsProvider/__utils__/factory'
import {defaultScore} from 'Event/PointsProvider/__utils__/StaticPointsProvider'
import {goToEventConfig} from 'organization/Event/__utils__/event'

const mockGet = axios.get as jest.Mock

export async function goToDashboardConfig(options: {event?: ObvioEvent} = {}) {
  const context = await goToEventConfig(options)

  // Dashboard requests
  mockGet.mockImplementationOnce(() => Promise.resolve({data: [fakeAction()]})) // Platform actions
  mockGet.mockImplementationOnce(() => Promise.resolve({data: []})) // Custom actions
  mockGet.mockImplementationOnce(() => Promise.resolve({data: defaultScore})) // Custom actions

  // Configure dashboard
  user.click(await context.findByLabelText('configure dashboard'))

  return context
}
