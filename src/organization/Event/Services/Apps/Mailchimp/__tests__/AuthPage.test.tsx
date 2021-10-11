import App from 'App'
import {fakeEvent} from 'Event/__utils__/factory'
import React from 'react'
import {render} from '__utils__/render'
import axios from 'axios'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import {fakeOrganization} from 'obvio/Organizations/__utils__/factory'
import {useLocation} from 'react-router-dom'
import {TEAM_MEMBER_TOKEN_KEY} from 'obvio/auth'
import {ALL_PERMISSIONS} from 'organization/__utils__/factory'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {fakeMailchimpIntegration} from 'organization/Event/Services/Apps/Mailchimp/__utils__/factory'

const mockGet = axios.get as jest.Mock
const mockPost = axios.post as jest.Mock
const mockUseLocation = useLocation as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should complete authorization', async () => {
  const organization = fakeOrganization()
  window.localStorage.setItem(TEAM_MEMBER_TOKEN_KEY, 'mytoken')

  const event = fakeEvent()

  const pathname = `/organization/${organization.slug}/events/${event.slug}/services/mailchimp`
  const code = 'secretmailchimpcode'

  // useLocation is used to determin the current app...
  mockUseLocation.mockImplementation(() => ({
    pathname,
    search: `?code=${code}`,
  }))

  // react-router uses the history.location to determine the URL to match the Route paths...
  Object.defineProperty(window, 'location', {
    value: {
      host: `app.obv.io`,
      pathname,

      /**
       * 'search' & 'hash' are appended to the pathname! So without them defined, it would be
       * 'pathnameundefinedundefined', which causes the route matching to fail!
       */

      search: '',
      hash: '',
    },
  })

  // Organization
  mockGet.mockImplementationOnce(() => Promise.resolve({data: organization}))
  // User
  mockGet.mockImplementationOnce(() =>
    Promise.resolve({data: fakeTeamMember()}),
  )
  // Owner
  mockGet.mockImplementationOnce(() =>
    Promise.resolve({data: fakeTeamMember()}),
  )
  // User Permissions
  mockGet.mockImplementationOnce(() =>
    Promise.resolve({data: [CONFIGURE_EVENTS]}),
  )
  // All Permissions
  mockGet.mockImplementationOnce(() => Promise.resolve({data: ALL_PERMISSIONS}))
  // ckeditor token
  mockGet.mockImplementationOnce(() =>
    Promise.resolve({data: {token: 'ckeditortoken'}}),
  )
  // event
  mockGet.mockImplementationOnce(() => Promise.resolve({data: event}))

  const unlinked = fakeMailchimpIntegration({is_linked: false})
  mockGet.mockImplementationOnce(() => Promise.resolve({data: [unlinked]}))

  mockGet.mockImplementationOnce(() => Promise.resolve({data: []})) // tokens

  mockPost.mockImplementationOnce(() =>
    Promise.resolve({
      data: fakeMailchimpIntegration({
        is_linked: true,
      }),
    }),
  )

  const {findByLabelText} = render(<App />, {withRouter: true})

  // Shows config on success
  expect(await findByLabelText('pick audience id')).toBeInTheDocument()

  /**
   * Assert sent correct code
   */

  const [url, data] = mockPost.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}/integrations/mailchimp/auth`)
  expect(data.auth_code).toBe(code)
})
