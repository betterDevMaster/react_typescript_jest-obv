import axios from 'axios'
import user from '@testing-library/user-event'
import {fakeAction} from 'Event/ActionsProvider/__utils__/factory'
import {
  EventOverrides,
  goToEventConfig,
} from 'organization/Event/__utils__/event'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'

const mockGet = axios.get as jest.Mock

export async function goToDashboardConfig(options: EventOverrides = {}) {
  const userPermissions = options.userPermissions || [CONFIGURE_EVENTS]

  const context = await goToEventConfig({...options, userPermissions})

  // Dashboard requests
  mockGet.mockImplementationOnce(() => Promise.resolve({data: [fakeAction()]})) // Platform actions
  mockGet.mockImplementationOnce(() => Promise.resolve({data: []})) // Custom actions

  // Configure dashboard
  user.click(await context.findByLabelText('configure dashboard'))

  return context
}
