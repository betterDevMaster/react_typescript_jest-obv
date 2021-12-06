import React from 'react'
import faker from 'faker'
import {authenticate} from '__utils__/auth'
import {render} from '__utils__/render'
import mockAxios from 'axios'
import App from 'App'
import user from '@testing-library/user-event'
import {fakeOrganization} from 'obvio/Organizations/__utils__/factory'
import {act} from '@testing-library/react'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import {setObvioAppUrl} from 'organization/__utils__/authenticate'
import {fakePlan} from 'obvio/Billing/__utils__/factory'

const mockGet = mockAxios.get as jest.Mock
const mockPost = mockAxios.post as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should create a new organization', async () => {
  setObvioAppUrl()
  authenticate(
    fakeTeamMember({
      has_active_subscription: true,
      plan: fakePlan({
        organization_limit: 2,
      }),
    }),
  )
  mockGet.mockImplementationOnce(() =>
    Promise.resolve({
      data: [], // organizations
    }),
  )
  mockPost.mockImplementationOnce(() =>
    Promise.resolve({data: fakeOrganization()}),
  )

  const {findByText, findByLabelText} = render(<App />)

  user.click(await findByText('Create Organization'))

  const name = faker.company.companyName()

  user.type(await findByLabelText('organization name'), name)
  user.click(await findByLabelText('create'))

  // Back to organizations screen
  expect(await findByText('Create Organization')).toBeInTheDocument()
})
