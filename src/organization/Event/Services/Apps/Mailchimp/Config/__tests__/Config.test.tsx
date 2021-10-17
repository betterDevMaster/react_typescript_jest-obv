import user from '@testing-library/user-event'
import axios from 'axios'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {
  fakeAudience,
  fakeField,
  fakeMailchimpIntegration,
  fakeTag,
} from 'organization/Event/Services/Apps/Mailchimp/__utils__/factory'
import {fireEvent, wait} from '@testing-library/react'
import {
  MailchimpIntegration,
  Tag,
} from 'organization/Event/Services/Apps/Mailchimp'
import {fakeAccessToken} from 'organization/Event/Services/AccessTokens/__utils__/factory'
import {goToMailchimp} from 'organization/Event/Services/Apps/Mailchimp/__utils__/go-to-mailchimp'

const mockGet = axios.get as jest.Mock
const mockPost = axios.post as jest.Mock
const mockPut = axios.put as jest.Mock
const mockPatch = axios.patch as jest.Mock

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

it('should complete mailchimp setup', async () => {
  const linkedMailchimp = fakeMailchimpIntegration({has_completed_setup: true})

  const audience = fakeAudience({
    name: 'My attendees',
  })

  const {findByLabelText, findByText, event} = await goToMailchimp({
    userPermissions: [CONFIGURE_EVENTS],
    integrations: [linkedMailchimp],
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
    is_linked: true,
  }

  mockPut.mockImplementationOnce(() => Promise.resolve({data: withAudience}))

  /**
   * Mock access token required for next step. Since we started
   * with 0 tokens, the select should automatically:
   * 1. Create a token
   * 2. Select a token
   */

  const token = fakeAccessToken()
  mockPost.mockImplementationOnce(() => Promise.resolve({data: token}))

  const withToken: MailchimpIntegration = {
    ...withAudience,
    access_token_id: token.id,
  }

  mockPut.mockImplementationOnce(() => Promise.resolve({data: withToken}))

  /**
   * Mock fetching login fields since it should auto-set access token (step 2) as we
   * do not have any tokens...
   */

  const loginField = fakeField({
    name: 'login_url',
  })
  mockGet.mockImplementationOnce(() =>
    Promise.resolve({data: [loginField, fakeField()]}),
  )

  /**
   * Mock requests for when steps are completed, and showing config
   */

  mockGet.mockImplementationOnce(() => Promise.resolve({data: [audience]})) // audience

  mockGet.mockImplementationOnce(
    () => Promise.resolve({data: [loginField, fakeField()]}), // login field
  )

  const tag = fakeTag({
    name: null,
    type: 'attendee_checked_in',
  })

  mockGet.mockImplementationOnce(
    () =>
      Promise.resolve({
        data: [tag],
      }), // tags
  )

  /**
   * Select audience
   */
  fireEvent.mouseDown(await findByLabelText('pick audience id'))
  user.click(await findByLabelText(`pick ${audience.name}`))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(2)
  })

  const [setAudienceUrl, setAudienceData] = mockPut.mock.calls[0]
  expect(setAudienceUrl).toMatch(
    `/events/${event.slug}/integrations/mailchimp/audience_id`,
  )
  expect(setAudienceData.id).toBe(audience.id)

  const [createTokenUrl] = mockPost.mock.calls[
    mockPost.mock.calls.length - 1 // get last call
  ]

  expect(createTokenUrl).toMatch(`/events/${event.slug}/access_tokens`)

  const [setTokenUrl, setTokenData] = mockPut.mock.calls[1]

  expect(setTokenUrl).toMatch(
    `/events/${event.slug}/integrations/mailchimp/access_token`,
  )
  expect(setTokenData.id).toBe(token.id)

  /**
   * Mock setting login field
   */

  const withLoginField: MailchimpIntegration = {
    ...withToken,
    login_url_field_id: loginField.id,
  }
  mockPut.mockImplementationOnce(() => Promise.resolve({data: withLoginField}))

  /**
   * Select login field
   */
  fireEvent.mouseDown(await findByLabelText('pick login field'))
  user.click(await findByLabelText(`pick ${loginField.name}`))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(3)
  })

  const [setLoginFieldUrl, setLoginFieldData] = mockPut.mock.calls[2]
  expect(setLoginFieldUrl).toMatch(
    `/events/${event.slug}/integrations/mailchimp/login_field`,
  )
  expect(setLoginFieldData.id).toBe(loginField.id)

  /**
   * Test setting a tag name
   */

  mockGet.mockImplementationOnce(() => Promise.reject('is new tag'))

  const tagName = 'CheckedInTag$$$'
  const withTagName: Tag = {
    ...tag,
    name: tagName,
  }

  mockPatch.mockImplementationOnce(() => Promise.resolve({data: withTagName}))

  user.type(await findByLabelText('tag name'), tagName)

  user.click(await findByText(/save/i))

  await wait(() => {
    expect(mockPatch).toHaveBeenCalledTimes(1)
  })

  const [saveTagUrl, saveTagData] = mockPatch.mock.calls[0]

  expect(saveTagUrl).toMatch(
    `/events/${event.slug}/integrations/mailchimp/tags/${tag.id}`,
  )
  expect(saveTagData.name).toBe(tagName)
})
