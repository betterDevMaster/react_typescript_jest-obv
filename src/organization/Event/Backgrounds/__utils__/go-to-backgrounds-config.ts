import user from '@testing-library/user-event'
import {
  EventOverrides,
  goToEventConfig,
} from 'organization/Event/__utils__/event'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'

export async function goToBackgrounds(overrides: EventOverrides = {}) {
  const options: EventOverrides = {
    userPermissions: [CONFIGURE_EVENTS],
    ...overrides,
  }

  const res = await goToEventConfig(options)

  user.click(await res.findByLabelText('backgrounds'))

  return res
}
