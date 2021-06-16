import user from '@testing-library/user-event'
import {
  EventOverrides,
  goToEventConfig,
} from 'organization/Event/__utils__/event'

afterEach(() => {
  jest.clearAllMocks()
})

export async function goToLeaderboardPageConfig(
  overrides: EventOverrides = {},
) {
  const result = await goToEventConfig(overrides)

  user.click(await result.findByLabelText('configure leaderboard'))

  return result
}
