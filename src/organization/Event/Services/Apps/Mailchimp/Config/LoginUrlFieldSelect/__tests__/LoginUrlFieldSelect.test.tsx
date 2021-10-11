import user from '@testing-library/user-event'
import axios from 'axios'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {
  fakeField,
  fakeMailchimpIntegration,
} from 'organization/Event/Services/Apps/Mailchimp/__utils__/factory'
import {wait} from '@testing-library/react'
import {MailchimpIntegration} from 'organization/Event/Services/Apps/Mailchimp'
import {fakeAccessToken} from 'organization/Event/Services/AccessTokens/__utils__/factory'
import {goToMailchimp} from 'organization/Event/Services/Apps/Mailchimp/__utils__/go-to-mailchimp'

const mockGet = axios.get as jest.Mock
const mockPost = axios.post as jest.Mock
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

it('should create a new field to use', async () => {
  const token = fakeAccessToken()
  const mailchimp = fakeMailchimpIntegration({
    is_linked: true,
    audience_id: 'someaudienceid', // already have audience
    access_token_id: token.id, // already have access token
    login_url_field_id: null,
  })

  const {findByLabelText, findByText, event} = await goToMailchimp({
    userPermissions: [CONFIGURE_EVENTS],
    integrations: [mailchimp],
    tokens: [token],
    beforeConfig: () => {
      mockGet.mockImplementationOnce(() =>
        Promise.resolve({data: [fakeField(), fakeField()]}),
      )
    },
  })

  /**
   * Create new login field
   */

  user.click(await findByText(/create new field/i))

  const name = 'MyNewField'
  const field = fakeField({name})

  user.type(await findByLabelText('new field name'), name)

  mockPost.mockImplementationOnce(() => Promise.resolve({data: field}))

  const withLoginField: MailchimpIntegration = {
    ...mailchimp,
    login_url_field_id: field.id,
  }
  mockPut.mockImplementationOnce(() => Promise.resolve({data: withLoginField}))

  user.click(await findByText(/save/i))

  /**
   * Assert created new field
   */

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [createUrl, createData] = mockPost.mock.calls[0]
  // http://localhost:8000/events/maya/integrations/mailchimp/fields { name: 'MyNewField' }

  expect(createUrl).toMatch(
    `/events/${event.slug}/integrations/mailchimp/fields`,
  )
  expect(createData.name).toBe(name)

  /**
   * Did automatically set the new field
   */

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [setLoginFieldUrl, setLoginFieldData] = mockPut.mock.calls[0]
  expect(setLoginFieldUrl).toMatch(
    `/events/${event.slug}/integrations/mailchimp/login_field`,
  )
  expect(setLoginFieldData.id).toBe(field.id)
})
