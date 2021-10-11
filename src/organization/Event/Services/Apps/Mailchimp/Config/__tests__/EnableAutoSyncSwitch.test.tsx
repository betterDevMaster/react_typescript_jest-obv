import user from '@testing-library/user-event'
import axios from 'axios'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {
  fakeAudience,
  fakeField,
  fakeMailchimpIntegration,
} from 'organization/Event/Services/Apps/Mailchimp/__utils__/factory'
import {wait} from '@testing-library/react'
import {MailchimpIntegration} from 'organization/Event/Services/Apps/Mailchimp'
import {fakeAccessToken} from 'organization/Event/Services/AccessTokens/__utils__/factory'
import {goToMailchimp} from 'organization/Event/Services/Apps/Mailchimp/__utils__/go-to-mailchimp'

const mockGet = axios.get as jest.Mock
const mockDelete = axios.delete as jest.Mock
const mockPut = axios.put as jest.Mock

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

it('should enable tags auto-sync', async () => {
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
  })

  const {findByLabelText, findByText, event} = await goToMailchimp({
    userPermissions: [CONFIGURE_EVENTS],
    integrations: [mailchimp],
    tokens: [token],
    beforeConfig: () => {
      mockGet.mockImplementationOnce(() => Promise.resolve({data: [audience]})) // audience
      mockGet.mockImplementationOnce(() => Promise.resolve({data: [field]})) // login fields
      mockGet.mockImplementationOnce(() => Promise.resolve({data: []})) // tags
    },
  })

  const syncEnabled: MailchimpIntegration = {
    ...mailchimp,
    auto_sync_tags_enabled: true,
  }

  /**
   * Because we're 'enabling', we expect it to be a PUT
   */
  mockPut.mockImplementationOnce(() => Promise.resolve({data: syncEnabled}))

  user.click(await findByLabelText('toggle auto sync tags'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [enableUrl] = mockPut.mock.calls[0]
  expect(enableUrl).toMatch(
    `/events/${event.slug}/integrations/mailchimp/tags/sync`,
  )

  /**
   * Assert toggling off (sends a DELETE)
   */

  mockDelete.mockImplementationOnce(() => Promise.resolve({data: syncEnabled}))

  user.click(await findByLabelText('toggle auto sync tags'))

  await wait(() => {
    expect(mockDelete).toHaveBeenCalledTimes(1)
  })

  const [disableUrl] = mockDelete.mock.calls[0]
  expect(disableUrl).toMatch(
    `/events/${event.slug}/integrations/mailchimp/tags/sync`,
  )
})
