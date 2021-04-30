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

const mockGet = mockAxios.get as jest.Mock
const mockPost = mockAxios.post as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should create a new organization', async () => {
  setObvioAppUrl()
  authenticate(fakeTeamMember({has_paid: true}))
  mockGet.mockImplementationOnce(() =>
    Promise.resolve({
      data: [],
    }),
  )
  mockPost.mockImplementationOnce(() =>
    Promise.resolve({data: fakeOrganization()}),
  )

  const {findByText, findByLabelText} = render(<App />)

  user.click(await findByText('Create Organization'))

  const name = faker.company.companyName()
  const slug = faker.internet.domainWord()

  await act(async () => {
    user.type(await findByLabelText('organization name'), name)
    user.type(await findByLabelText('domain slug'), slug)
    user.click(await findByLabelText('create'))
  })

  // Back to organizations screen
  expect(await findByText('Create Organization')).toBeInTheDocument()
})
