import {
  EventOverrides,
  goToEventConfig,
} from 'organization/Event/__utils__/event'
import user from '@testing-library/user-event'

export async function goToFormsConfig(overrides: EventOverrides = {}) {
  const context = await goToEventConfig(overrides)

  user.click(await context.findByLabelText('configure forms'))

  return context
}
