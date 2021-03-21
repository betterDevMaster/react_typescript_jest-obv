import App from 'App'
import faker from 'faker'
import React from 'react'
import {render} from '__utils__/render'
import user from '@testing-library/user-event'
import mockAxios from 'axios'
import {fakeUser} from 'auth/user/__utils__/factory'
import {act} from '@testing-library/react'
import {fakeOrganization} from 'obvio/Organizations/__utils__/factory'
import {useLocation} from 'react-router-dom'
import {organizationTokenKey} from 'organization/auth'

const mockPost = mockAxios.post as jest.Mock
const mockGet = mockAxios.get as jest.Mock
const mockUseLocation = useLocation as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should show the organiztion forgot form', async () => {
  const organization = fakeOrganization()
  const email = faker.internet.email()
  mockUseLocation.mockImplementation(() => ({
    pathname: `/organization/${organization.slug}`,
  }))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: organization}))

  const {findByLabelText} = render(<App />)

  expect(await findByLabelText('forgot password')).toBeInTheDocument()

  await act(async () => {
    user.click(await findByLabelText('forgot password'))
  })

  user.type(await findByLabelText('organiztion account email'), email)
  mockPost.mockImplementationOnce(() => Promise.resolve({data: 'ok'}))
  await act(async () => {
    user.click(await findByLabelText('submit reset password'))
  })

  expect(mockPost).toHaveBeenCalledTimes(1)

  const url = mockPost.mock.calls[0][0]

  expect(url).toMatch(`/organizations/${organization.slug}/forgot_password`)
})
