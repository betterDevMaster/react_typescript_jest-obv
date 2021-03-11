import App from 'App'
import faker from 'faker'
import {fakeEvent} from 'Event/__utils__/factory'
import React from 'react'
import {render} from '__utils__/render'
import axios from 'axios'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import {fakeOrganization} from 'obvio/Organizations/__utils__/factory'
import {organizationTokenKey} from 'organization/auth'
import {useLocation} from 'react-router-dom'
import {
  fakeInsusionsoftIntegration,
  fakeTag,
  tagTypes,
} from 'organization/Event/Services/Infusionsoft/__utils__/factory'

const mockGet = axios.get as jest.Mock
const mockPost = axios.post as jest.Mock
const mockUseLocation = useLocation as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should complete authorization', async () => {
  const organization = fakeOrganization()
  window.localStorage.setItem(
    organizationTokenKey(organization.slug),
    'mytoken',
  )

  const event = fakeEvent()

  const pathname = `/organization/${organization.slug}/events/${event.slug}/services/infusionsoft`

  // useLocation is used to determin the current app...
  mockUseLocation.mockImplementation(() => ({
    pathname,
    search: `?code=mycode`,
  }))

  // react-router uses the history.location to determine the URL to match the Route paths...
  Object.defineProperty(window, 'location', {
    value: {
      host: `obv.io`,
      pathname,

      /**
       * 'search' & 'hash' are appended to the pathname! So without them defined, it would be
       * 'pathnameundefinedundefined', which causes the route matching to fail!
       */

      search: '',
      hash: '',
    },
  })

  mockGet.mockImplementationOnce(() => Promise.resolve({data: organization}))

  mockGet.mockImplementationOnce(() =>
    Promise.resolve({data: fakeTeamMember()}),
  )

  mockGet.mockImplementationOnce(() =>
    Promise.resolve({data: fakeTeamMember()}),
  )
  // event
  mockGet.mockImplementationOnce(() => Promise.resolve({data: event}))

  // integrations

  const unlinked = fakeInsusionsoftIntegration({is_linked: false})
  mockGet.mockImplementationOnce(() => Promise.resolve({data: [unlinked]}))

  mockPost.mockImplementationOnce(() =>
    Promise.resolve({
      data: fakeInsusionsoftIntegration({
        has_completed_setup: true,
        is_linked: true,
      }),
    }),
  )

  const tags = tagTypes.map((type) => fakeTag({type}))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: tags}))

  const {findAllByLabelText} = render(<App />, {withRouter: true})

  // Shows config on success
  expect((await findAllByLabelText('tag id')).length).toBe(tags.length)
})
