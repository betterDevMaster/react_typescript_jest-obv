import ResetPassword from 'obvio/auth/ResetPassword'
import faker from 'faker'
import React from 'react'
import {render} from '__utils__/render'
import user from '@testing-library/user-event'
import mockAxios from 'axios'
import {act} from '@testing-library/react'

const mockPost = mockAxios.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should show the obvio Reset Password form', async () => {
  const email = faker.internet.email()
  const token = 'secrettoken'
  const link = `obv.io/reset_password?email=${email}&token=${token}`
  const password = 'mypw'

  Object.defineProperty(window, 'location', {
    value: {
      host: link, // Root, no subdomain
    },
  })

  const {findByLabelText} = render(<ResetPassword />)

  expect(await findByLabelText('obvio account password')).toBeInTheDocument()
  expect(
    await findByLabelText('obvio account password confirmation'),
  ).toBeInTheDocument()

  user.type(await findByLabelText('obvio account password'), password)
  user.type(
    await findByLabelText('obvio account password confirmation'),
    password,
  )

  mockPost.mockImplementationOnce(() => Promise.resolve({data: 'ok'}))

  await act(async () => {
    user.click(await findByLabelText('submit reset password'))
  })

  expect(mockPost).toHaveBeenCalledTimes(1)

  const url = mockPost.mock.calls[0][0]

  expect(url).toMatch(`reset_password`)
  expect(await findByLabelText('back to login')).toBeInTheDocument()
})
