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

it('should show selector with multiple tokens', async () => {
  const linkedMailchimp = fakeMailchimpIntegration({is_linked: true})

  const tokenOne = fakeAccessToken()
  const tokenTwo = fakeAccessToken()

  const audience = fakeAudience({
    name: 'My attendees',
  })

  const {findByLabelText, event} = await goToMailchimp({
    userPermissions: [CONFIGURE_EVENTS],
    integrations: [linkedMailchimp],
    beforeConfig: () => {
      mockGet.mockImplementationOnce(() => Promise.resolve({data: [audience]})) // audience
    },
    tokens: [tokenOne, tokenTwo], // have tokens
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
    access_token_id: tokenTwo.id,
  }

  mockPut.mockImplementationOnce(() => Promise.resolve({data: withToken}))

  /**
   * Select audience
   */
  fireEvent.mouseDown(await findByLabelText('pick audience id'))
  user.click(await findByLabelText(`pick ${audience.name}`))

  /**
   * Required to manually select token
   */

  fireEvent.mouseDown(await findByLabelText('pick access token'))
  user.click(await findByLabelText(`pick ${tokenTwo.value}`))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(2)
  })

  const [setAudienceUrl, setAudienceData] = mockPut.mock.calls[0]
  expect(setAudienceUrl).toMatch(
    `/events/${event.slug}/integrations/mailchimp/audience_id`,
  )
  expect(setAudienceData.id).toBe(audience.id)

  /**
   * Assert did select correct token
   */

  const [setTokenUrl, setTokenData] = mockPut.mock.calls[1]

  expect(setTokenUrl).toMatch(
    `/events/${event.slug}/integrations/mailchimp/access_token`,
  )
  expect(setTokenData.id).toBe(tokenTwo.id)
})
