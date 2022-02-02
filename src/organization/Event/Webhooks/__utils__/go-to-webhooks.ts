import user from '@testing-library/user-event'
import {
  EventOverrides,
  goToEventConfig,
} from 'organization/Event/__utils__/event'
import axios from 'axios'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {AccessToken} from 'organization/Event/Services/AccessTokens/AccessTokensProvider'
import {Webhook} from 'organization/Event/WebhooksProvider'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import {fakePlan} from 'obvio/Billing/__utils__/factory'
import {TeamMember} from 'auth/user'

const mockGet = axios.get as jest.Mock

export async function goToWebhooks(
  overrides: EventOverrides & {
    access_tokens?: AccessToken[]
    webhooks?: Webhook[]
    owner?: TeamMember
  } = {},
) {
  const userPermissions = overrides.userPermissions || [CONFIGURE_EVENTS]

  const access_tokens = overrides.access_tokens || []
  const webhooks = overrides.webhooks || []

  const owner =
    overrides.owner ||
    fakeTeamMember({
      has_active_subscription: true,
      has_unpaid_transactions: false,
      plan: fakePlan({name: 'enterprise'}),
      credits: 0, // start with 0 credits
    })

  const context = await goToEventConfig({
    ...overrides,
    userPermissions,
    owner,
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
