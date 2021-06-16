import axios from 'axios'
import user from '@testing-library/user-event'
import {
  EventOverrides,
  goToEventConfig,
} from 'organization/Event/__utils__/event'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {Area} from 'organization/Event/AreasProvider'
import {Action} from 'Event/ActionsProvider'

const mockGet = axios.get as jest.Mock

type Overrides = EventOverrides & {
  areas?: Area[]
  actions?: Action[]
}

export async function goToDashboardConfig(overrides: Overrides = {}) {
  const userPermissions = overrides.userPermissions || [CONFIGURE_EVENTS]

  const areas = overrides.areas || []
  const actions = overrides.actions || []

  const context = await goToEventConfig({...overrides, userPermissions})

  // Dashboard requests
  mockGet.mockImplementationOnce(() => Promise.resolve({data: areas})) // areas
  mockGet.mockImplementationOnce(() => Promise.resolve({data: actions})) // actions

  // Configure dashboard
  user.click(await context.findByLabelText('configure dashboard'))

  return context
}
