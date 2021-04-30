import App from 'App'
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

it('should show the obvio forgot form', async () => {
  Object.defineProperty(window, 'location', {
    value: {
      host: `app.obv.io`,
    },
  })

  const {findByLabelText} = render(<App />)

  expect(await findByLabelText('forgot password')).toBeInTheDocument()
  const email = faker.internet.email()
  await act(async () => {
    user.click(await findByLabelText('forgot password'))
  })

  user.type(await findByLabelText('obvio account email'), email)
  mockPost.mockImplementationOnce(() => Promise.resolve({data: 'ok'}))
  await act(async () => {
    user.click(await findByLabelText('submit reset password'))
  })

  expect(mockPost).toHaveBeenCalledTimes(1)

  const url = mockPost.mock.calls[0][0]

  expect(url).toMatch(`forgot_password`)
})
