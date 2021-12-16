import faker from 'faker'
import React from 'react'
import {render} from '__utils__/render'
import mockAxios from 'axios'
import App from 'App'
import {fakeOrganization} from 'obvio/Organizations/__utils__/factory'
import {TEAM_MEMBER_TOKEN_KEY} from 'obvio/auth'
import {setObvioAppUrl} from 'organization/__utils__/authenticate'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import {fakeEvent} from 'Event/__utils__/factory'
import {useLocation} from 'react-router-dom'
import {fakePlan} from 'obvio/Billing/__utils__/factory'

const mockGet = mockAxios.get as jest.Mock
const mockUseLocation = useLocation as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should show the user organizations', async () => {
  setObvioAppUrl()

  const token = 'userauthtoken'
  window.localStorage.setItem(TEAM_MEMBER_TOKEN_KEY, token)
  const numOrganizations = faker.random.number({min: 1, max: 3})
  const organizations = Array.from(
    {
      length: numOrganizations,
    },
    fakeOrganization,
  )
  mockGet.mockImplementationOnce(() =>
    Promise.resolve({
      data: fakeTeamMember({
        has_active_subscription: true,
        plan: fakePlan({name: 'founder'}),
      }),
    }),
  )
  mockGet.mockImplementationOnce(() =>
    Promise.resolve({
      data: organizations,
    }),
  )

  const {findByLabelText} = render(<App />)

  // Renders every organization
  for (const o of organizations) {
    expect(await findByLabelText(new RegExp(o.name))).toBeInTheDocument()
  }

  expect(mockGet).toBeCalledTimes(2)
})

it('should automatically redirect to organization', async () => {
  setObvioAppUrl()

  const token = 'userauthtoken'
  window.localStorage.setItem(TEAM_MEMBER_TOKEN_KEY, token)

  const organization = fakeOrganization({joined: true})

  // Mock useLocation since its used to determine whether we are in
  // organization page, or obvio pages.
  mockUseLocation.mockImplementation(() => ({
    pathname: `/organization/${organization.id}`,
  }))

  mockGet.mockImplementationOnce(() =>
    Promise.resolve({
      data: [organization],
    }),
  )

  const event = fakeEvent()

  // Is vaild organization
  mockGet.mockImplementationOnce(() => Promise.resolve({data: organization}))

  // Organization Owner
  mockGet.mockImplementationOnce(() =>
    Promise.resolve({
      data: fakeTeamMember({
        has_active_subscription: true,
      }),
    }),
  )

  // Payment
  mockGet.mockImplementationOnce(() => Promise.resolve({data: null}))

  // User Permissions
  mockGet.mockImplementationOnce(() => Promise.resolve({data: []}))

  // All Permissions
  mockGet.mockImplementationOnce(() => Promise.resolve({data: []}))

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
  mockGet.mockImplementationOnce(() => Promise.resolve({data: [event]}))

  const {findByText} = render(<App />)

  // Did redirect to organization page, and is showing
  // events
  expect(await findByText(event.name)).toBeInTheDocument()
})
