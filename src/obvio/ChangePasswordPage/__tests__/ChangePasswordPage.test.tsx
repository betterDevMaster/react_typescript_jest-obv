import React from 'react'
import faker from 'faker'
import {authenticate} from '__utils__/auth'
import {render} from '__utils__/render'
import mockAxios from 'axios'
import App from 'App'
import user from '@testing-library/user-event'
import {fakeOrganization} from 'obvio/Organizations/__utils__/factory'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import {setObvioAppUrl} from 'organization/__utils__/authenticate'
import {wait} from '@testing-library/react'

const mockGet = mockAxios.get as jest.Mock
const mockPut = mockAxios.put as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should change password', async () => {
  setObvioAppUrl()
  authenticate(fakeTeamMember({has_active_subscription: true}))
  mockGet.mockImplementationOnce(() =>
    Promise.resolve({
      data: [],
    }),
  )
  mockPut.mockImplementationOnce(() =>
    Promise.resolve({data: fakeOrganization()}),
  )

  const {findByLabelText, findByText} = render(<App />)

  user.click(await findByLabelText('change password'))

  expect(await findByLabelText('current password')).toBeInTheDocument()
  expect(await findByLabelText('new password')).toBeInTheDocument()
  expect(await findByLabelText('password confirmation')).toBeInTheDocument()

  const password = faker.lorem.words(8)

  user.type(await findByLabelText('current password'), 'password')
  user.type(await findByLabelText('new password'), password)
  user.type(await findByLabelText('password confirmation'), password)

  mockPut.mockImplementationOnce(() => Promise.resolve({data: true}))

  user.click(await findByLabelText('submit change password'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  expect(await findByText(/password has been updated/i)).toBeInTheDocument()

  /**
   * Check submitted data
   */

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch('/password')

  expect(data.password).toBe('password')
  expect(data.new_password).toBe(password)
  expect(data.new_password_confirmation).toBe(password)
})
