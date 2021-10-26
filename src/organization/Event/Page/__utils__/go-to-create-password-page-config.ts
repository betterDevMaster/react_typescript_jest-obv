import user from '@testing-library/user-event'
import {
  EventOverrides,
  goToEventConfig,
} from 'organization/Event/__utils__/event'

export async function goToCreatePasswordPageConfig(
  overrides: EventOverrides = {},
) {
  const res = await goToEventConfig(overrides)

  user.click(await res.findByLabelText('password create'))

  return res
}
