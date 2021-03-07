import {goToEventConfig} from 'organization/Event/__utils__/event'
import {ObvioEvent} from 'Event'
import user from '@testing-library/user-event'

export async function goToQuestionsConfig(
  overrides: {event?: ObvioEvent} = {},
) {
  const context = await goToEventConfig(overrides)

  user.click(await context.findByLabelText('configure questions'))

  return context
}
