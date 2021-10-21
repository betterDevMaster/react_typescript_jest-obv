import user from '@testing-library/user-event'
import axios from 'axios'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {
  fakeAudience,
  fakeField,
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

it('should prompt confirmation', async () => {
  const token = fakeAccessToken()
  const field = fakeField()
  const existingAudience = fakeAudience({name: 'ExistingList'})
  const newAudience = fakeAudience({name: 'NewList'})

  /**
   * Have an integration that has already completed setup...
   */
  const mailchimp = fakeMailchimpIntegration({
    is_linked: true,
    audience_id: existingAudience.id,
    access_token_id: token.id,
    login_url_field_id: field.id,
    has_completed_setup: true,
  })

  const {findByLabelText, findByText, event} = await goToMailchimp({
    userPermissions: [CONFIGURE_EVENTS],
    integrations: [mailchimp],
    tokens: [token],
    beforeConfig: () => {
      mockGet.mockImplementationOnce(() =>
        Promise.resolve({data: [existingAudience, newAudience]}),
      ) // audience
      mockGet.mockImplementationOnce(() => Promise.resolve({data: [field]})) // login fields
      mockGet.mockImplementationOnce(() => Promise.resolve({data: []})) // tags
    },
  })

  const withNewAudience: MailchimpIntegration = {
    ...mailchimp,
    audience_id: newAudience.id,
  }

  /**
   * Because we're 'enabling', we expect it to be a PUT
   */
  mockPut.mockImplementationOnce(() => Promise.resolve({data: withNewAudience}))

  /**
   * Select audience
   */
  fireEvent.mouseDown(await findByLabelText('pick audience id'))
  user.click(await findByLabelText(`pick ${newAudience.name}`))

  /**
   * Assert shows confirm dialog...
   */

  user.click(await findByLabelText('confirm'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  /**
   * Check that it DID set the new audience
   */
  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(
    `/events/${event.slug}/integrations/mailchimp/audience_id`,
  )
  expect(data.id).toBe(newAudience.id)
})
