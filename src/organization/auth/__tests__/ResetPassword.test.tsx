import faker from 'faker'
import React from 'react'
import {render} from '__utils__/render'
import user from '@testing-library/user-event'
import mockAxios from 'axios'
import {fakeOrganization} from 'obvio/Organizations/__utils__/factory'
import {useLocation} from 'react-router-dom'
import App from 'App'
import {wait} from '@testing-library/react'

const mockPost = mockAxios.post as jest.Mock
const mockGet = mockAxios.get as jest.Mock
const mockUseLocation = useLocation as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should reset the password', async () => {
  const email = faker.internet.email()
  const token = 'secrettoken'
  const password = 'mypw'
  const organization = fakeOrganization()

  const pathname = `/organization/${organization.slug}/reset_password`
  const search = `?email=${email}&token=${token}`

  mockUseLocation.mockImplementation(() => ({
    pathname,
    search,
  }))

  Object.defineProperty(window, 'location', {
    value: {
      host: 'app.obv.io',
      pathname,
      search,
      hash: '',
    },
  })

  mockGet.mockImplementationOnce(() => Promise.resolve({data: organization}))

  const {findByLabelText} = render(<App />, {
    organization: organization,
  })

  user.type(await findByLabelText('organization account password'), password)
  user.type(
    await findByLabelText('organization account password confirmation'),
    password,
  )

  mockPost.mockImplementationOnce(() => Promise.resolve({data: 'ok'}))

  user.click(await findByLabelText('submit reset password'))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]

  expect(url).toMatch(`/organizations/${organization.slug}/reset_password`)
  expect(await findByLabelText('back to login')).toBeInTheDocument()

  expect(data.token).toBe(token)
  expect(data.email).toBe(email)
  expect(data.password).toBe(password)
  expect(data.password_confirmation).toBe(password)
})
