import {ALL_PERMISSIONS} from 'organization/__utils__/factory'
import faker from 'faker'
import {ObvioEvent} from 'Event'
import {fakeOrganization} from 'obvio/Organizations/__utils__/factory'
import {useLocation} from 'react-router-dom'
import axios from 'axios'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import {TEAM_MEMBER_TOKEN_KEY} from 'obvio/auth'
import {Permission} from 'organization/PermissionsProvider'
import {TeamMember} from 'auth/user'

const mockUseLocation = useLocation as jest.Mock
const mockGet = axios.get as jest.Mock

export function setObvioAppUrl() {
  Object.defineProperty(window, 'location', {
    value: {
      host: `app.obv.io`,
      pathname: '',
      search: '',
      hash: '',
    },
  })
}

export function signInToOrganization(
  overrides: {
    events?: ObvioEvent[]
    authUser?: TeamMember
    owner?: TeamMember
    userPermissions?: Permission[]
  } = {},
) {
  setObvioAppUrl()

  const events = overrides.events || []
  const authUser = overrides.authUser || fakeTeamMember()
  const owner = overrides.owner || fakeTeamMember()
  const userPermissions = overrides.userPermissions || []

  const organization = fakeOrganization()
  const token = faker.random.alphaNumeric(8)

  // is already logged in user
  window.localStorage.setItem(TEAM_MEMBER_TOKEN_KEY, token)
  mockUseLocation.mockImplementation(() => ({
    pathname: `/organization/${organization.id}`,
  }))

  // Is vaild organization slug
  mockGet.mockImplementationOnce(() => Promise.resolve({data: organization}))
  // Authenticated
  mockGet.mockImplementationOnce(() => Promise.resolve({data: authUser}))
  // Organization Owner
  mockGet.mockImplementationOnce(() => Promise.resolve({data: owner}))
  // User Permissions
  mockGet.mockImplementationOnce(() => Promise.resolve({data: userPermissions}))
  // All Permissions
  mockGet.mockImplementationOnce(() => Promise.resolve({data: ALL_PERMISSIONS}))
  // CKEditor token
  mockGet.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        token:
          // Dummy JWT
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIwOTYxNGYyYy05OTY0LTRjN2MtYTBjOS1jMjA5OWNlZTQ5YTIiLCJpYXQiOjE2MjE4NTE5NDgsImV4cCI6MTYyMTg1NTU0OH0.X3qYxn5IYvab7U54rzwimFaxJl873tTgN3m0VcrCTC8',
      },
    }),
  )
  // Fetch events
  mockGet.mockImplementationOnce(() => Promise.resolve({data: events}))

  return {organization, authUser, owner, token}
}
