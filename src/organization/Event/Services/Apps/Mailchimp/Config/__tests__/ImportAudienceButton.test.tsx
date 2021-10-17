import user from '@testing-library/user-event'
import axios from 'axios'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {
  fakeAudience,
  fakeField,
  fakeMailchimpIntegration,
} from 'organization/Event/Services/Apps/Mailchimp/__utils__/factory'
import {wait} from '@testing-library/react'
import {fakeAccessToken} from 'organization/Event/Services/AccessTokens/__utils__/factory'
import {goToMailchimp} from 'organization/Event/Services/Apps/Mailchimp/__utils__/go-to-mailchimp'

const mockGet = axios.get as jest.Mock
const mockPost = axios.post as jest.Mock

/**
 * Silence console.warn because <Select/> throws an error
 * while it's re-fetching login fields on initial config
 * setup complete.
 */
beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {})
})

afterAll(() => {
  // @ts-ignore
  console.warn.mockRestore()
})

beforeEach(() => {
  jest.clearAllMocks()
})

it('should send a request to sync', async () => {
  const token = fakeAccessToken()
  const field = fakeField()
  const audience = fakeAudience()

  /**
   * Have an integration that has already completed setup...
   */
  const mailchimp = fakeMailchimpIntegration({
    is_linked: true,
    audience_id: audience.id,
    access_token_id: token.id,
    login_url_field_id: field.id,
    auto_sync_tags_enabled: false, // start false
    has_completed_setup: true,
  })

  const {findByText, event} = await goToMailchimp({
    userPermissions: [CONFIGURE_EVENTS],
    integrations: [mailchimp],
    tokens: [token],
    beforeConfig: () => {
      mockGet.mockImplementationOnce(() => Promise.resolve({data: [audience]})) // audience
      mockGet.mockImplementationOnce(() => Promise.resolve({data: [field]})) // login fields
      mockGet.mockImplementationOnce(() => Promise.resolve({data: []})) // tags
    },
  })

  mockPost.mockImplementationOnce(() => Promise.resolve({data: 'ok'}))

  user.click(await findByText(/import audience/i))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [importUrl] = mockPost.mock.calls[0]
  expect(importUrl).toMatch(
    `/events/${event.slug}/integrations/mailchimp/audiences/import`,
  )
})
