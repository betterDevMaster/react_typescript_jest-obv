import user from '@testing-library/user-event'
import {ObvioEvent} from 'Event'
import {
  EventOverrides,
  goToEventConfig,
} from 'organization/Event/__utils__/event'

afterEach(() => {
  jest.clearAllMocks()
})

export async function goToSpeakerConfig(overrides: EventOverrides = {}) {
  const result = await goToEventConfig(overrides)

  user.click(await result.findByLabelText('configure speakers'))

  return result
}
