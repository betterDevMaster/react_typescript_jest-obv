import user from '@testing-library/user-event'
import {
  EventOverrides,
  goToEventConfig,
} from 'organization/Event/__utils__/event'

export async function goToGeneralConfig(overrides: EventOverrides = {}) {
  const res = await goToEventConfig(overrides)

  user.click(await res.findByLabelText('general config'))

  return res
}
