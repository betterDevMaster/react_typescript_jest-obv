import faker from 'faker'
import React from 'react'
import {render} from '__utils__/render'
import user from '@testing-library/user-event'
import mockAxios from 'axios'
import {act} from '@testing-library/react'
import {fakeOrganization} from 'obvio/Organizations/__utils__/factory'
import {useLocation} from 'react-router-dom'
import ResetPassword from 'organization/auth/ResetPassword'

const mockPost = mockAxios.post as jest.Mock
const mockGet = mockAxios.get as jest.Mock
const mockUseLocation = useLocation as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should show the organization Reset Password form', async () => {
  const email = faker.internet.email()
  const token = 'secrettoken'
  const password = 'mypw'
  const organization = fakeOrganization()

  mockUseLocation.mockImplementation(() => ({
    pathname: `/organization/${organization.slug}/reset_password?email=${email}&token=${token}`,
  }))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: organization}))

  const {findByLabelText} = render(<ResetPassword />, {
    organization: organization,
  })

  expect(
    await findByLabelText('organization account password'),
  ).toBeInTheDocument()
  expect(
    await findByLabelText('organization account password confirmation'),
  ).toBeInTheDocument()

  user.type(await findByLabelText('organization account password'), password)
  user.type(
    await findByLabelText('organization account password confirmation'),
    password,
  )

  mockPost.mockImplementationOnce(() => Promise.resolve({data: 'ok'}))

  await act(async () => {
    user.click(await findByLabelText('submit reset password'))
  })

  expect(mockPost).toHaveBeenCalledTimes(1)

  const url = mockPost.mock.calls[0][0]

  expect(url).toMatch(`/organizations/${organization.slug}/reset_password`)
  expect(await findByLabelText('back to login')).toBeInTheDocument()
})
