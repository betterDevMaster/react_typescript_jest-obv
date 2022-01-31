import user from '@testing-library/user-event'
import {
  EventOverrides,
  goToEventConfig,
} from 'organization/Event/__utils__/event'
import axios from 'axios'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {AccessToken} from 'organization/Event/Services/AccessTokens/AccessTokensProvider'
import {Webhook} from 'organization/Event/WebhooksProvider'

const mockGet = axios.get as jest.Mock

export async function goToWebhooks(
  overrides: EventOverrides & {
    access_tokens?: AccessToken[]
    webhooks?: Webhook[]
  } = {},
) {
  const userPermissions = overrides.userPermissions || [CONFIGURE_EVENTS]

  const access_tokens = overrides.access_tokens || []
  const webhooks = overrides.webhooks || []

  const context = await goToEventConfig({
    ...overrides,
    userPermissions,
  })

  /**
   * Fetch Access T0kens
   */
  mockGet.mockImplementationOnce(() => Promise.resolve({data: access_tokens}))

  /**
   * Fetch Webhook data
   */
  mockGet.mockImplementationOnce(() => Promise.resolve({data: webhooks}))

  user.click(await context.findByText(/webhooks/i))

  return context
}
