import faker from 'faker'
import React from 'react'
import {render} from '__utils__/render'
import user from '@testing-library/user-event'
import mockAxios from 'axios'
import {act, wait} from '@testing-library/react'
import App, {appRoot} from 'App'
import {useLocation} from 'react-router-dom'

const mockPost = mockAxios.post as jest.Mock
const mockUseLocation = useLocation as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should reset the user password', async () => {
  const email = faker.internet.email()
  const token = 'secrettoken'
  const password = 'mypw'

  const pathname = '/reset_password'
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

  const {findByLabelText} = render(<App />)

  user.type(await findByLabelText('obvio account password'), password)
  user.type(
    await findByLabelText('obvio account password confirmation'),
    password,
  )

  mockPost.mockImplementationOnce(() => Promise.resolve({data: 'ok'}))

  await act(async () => {
    user.click(await findByLabelText('submit reset password'))
  })

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]

  expect(url).toMatch(`/reset_password`)
  expect(await findByLabelText('back to login')).toBeInTheDocument()

  expect(data.token).toBe(token)
  expect(data.email).toBe(email)
  expect(data.password).toBe(password)
  expect(data.password_confirmation).toBe(password)
})
