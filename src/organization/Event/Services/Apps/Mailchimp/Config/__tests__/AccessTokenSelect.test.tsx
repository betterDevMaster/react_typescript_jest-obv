import user from '@testing-library/user-event'
import axios from 'axios'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {
  fakeAudience,
  fakeMailchimpIntegration,
} from 'organization/Event/Services/Apps/Mailchimp/__utils__/factory'
import {fireEvent, wait} from '@testing-library/react'
import {MailchimpIntegration} from 'organization/Event/Services/Apps/Mailchimp'
import {fakeAccessToken} from 'organization/Event/Services/AccessTokens/__utils__/factory'
import {goToMailchimp} from 'organization/Event/Services/Apps/Mailchimp/__utils__/go-to-mailchimp'

const mockGet = axios.get as jest.Mock
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

it('should pre-select a single token', async () => {
  const token = fakeAccessToken()
  const linkedMailchimp = fakeMailchimpIntegration({has_completed_setup: true})

  const audience = fakeAudience({
    name: 'My attendees',
  })

  const {findByLabelText, event} = await goToMailchimp({
    userPermissions: [CONFIGURE_EVENTS],
    integrations: [linkedMailchimp],
    tokens: [token], // Already start with 1 token
    beforeConfig: () => {
      mockGet.mockImplementationOnce(() => Promise.resolve({data: [audience]})) // audience
    },
  })

  /**
   * Select an audience
   */

  const withAudience: MailchimpIntegration = {
    ...linkedMailchimp,
    audience_id: audience.id,
  }

  mockPut.mockImplementationOnce(() => Promise.resolve({data: withAudience}))

  const withToken: MailchimpIntegration = {
    ...withAudience,
    access_token_id: token.id,
  }

  mockPut.mockImplementationOnce(() => Promise.resolve({data: withToken}))

  /**
   * Select audience
   */
  fireEvent.mouseDown(await findByLabelText('pick audience id'))
  user.click(await findByLabelText(`pick ${audience.name}`))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(2)
  })

  /**
   * Verify it auto-selected the first token
   */

  const [setTokenUrl, setTokenData] = mockPut.mock.calls[1]

  expect(setTokenUrl).toMatch(
    `/events/${event.slug}/integrations/mailchimp/access_token`,
  )
  expect(setTokenData.id).toBe(token.id)
})
