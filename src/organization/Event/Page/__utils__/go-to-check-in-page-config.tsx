import user from '@testing-library/user-event'
import {
  EventOverrides,
  goToEventConfig,
} from 'organization/Event/__utils__/event'

export async function goToCheckInPageConfig(overrides: EventOverrides = {}) {
  const res = await goToEventConfig(overrides)

  user.click(await res.findByLabelText('check in'))

  return res
}
