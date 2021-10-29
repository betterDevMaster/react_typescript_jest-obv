import faker from 'faker'
import React from 'react'
import {render} from '__utils__/render'
import mockAxios from 'axios'
import App from 'App'
import {fakeOrganization} from 'obvio/Organizations/__utils__/factory'
import {TEAM_MEMBER_TOKEN_KEY} from 'obvio/auth'
import {setObvioAppUrl} from 'organization/__utils__/authenticate'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import {signInToObvio} from 'obvio/__utils__/sign-in-to-obvio'

const mockGet = mockAxios.get as jest.Mock

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
    Promise.resolve({data: fakeTeamMember({has_active_subscription: true})}),
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

it('should redirect to billing', async () => {
  const teamMember = fakeTeamMember({
    has_active_subscription: false, // no subscription
    has_payment_method: false,
    plan: null,
  })

  const {findByText} = await signInToObvio({
    beforeRender: () => {
      // Has no paymetn method
      mockGet.mockResolvedValueOnce({data: null})
    },
    user: teamMember,
  })

  expect(await findByText('Billing & Subscription')).toBeInTheDocument()
})
