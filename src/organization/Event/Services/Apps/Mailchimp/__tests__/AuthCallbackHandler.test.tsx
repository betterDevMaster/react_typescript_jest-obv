import App from 'App'
import {fakeEvent} from 'Event/__utils__/factory'
import React from 'react'
import {render} from '__utils__/render'
import axios from 'axios'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import {fakeOrganization} from 'obvio/Organizations/__utils__/factory'
import {useLocation} from 'react-router-dom'
import {TEAM_MEMBER_TOKEN_KEY} from 'obvio/auth'
import {wait} from '@testing-library/dom'

const mockGet = axios.get as jest.Mock
const mockUseLocation = useLocation as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

/**
 * Mock react-router-dom once here to include useHistory. We usually
 * don't want to mock history because we're testing nav, but in
 * this case we only care that `push` was called correctly.
 */

const mockPush = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(() => ({
    search: '',
    pathname: '',
  })),
  useHistory: () => ({
    push: mockPush,
  }),
}))

it('should redirect to event auth page with code', async () => {
  const organization = fakeOrganization()
  window.localStorage.setItem(TEAM_MEMBER_TOKEN_KEY, 'mytoken')

  const event = fakeEvent()

  const pathname = '/mailchimp/auth'

  const code = 'secretmailchimpauthcode'

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

  const route = `/organization/${organization.slug}/events/${event.slug}/services/mailchimp`

  window.localStorage.setItem('__mailchimp_auth_event__', route)

  render(<App />, {withRouter: true})

  await wait(() => {
    expect(mockPush).toHaveBeenCalledTimes(1)
  })

  const [url] = mockPush.mock.calls[0]

  expect(url).toBe(`${route}?code=${code}`)
})
