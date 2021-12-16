import {fakeEvent} from 'Event/__utils__/factory'
import {visitEventSite} from 'Event/__utils__/url'
import React from 'react'
import {render} from '__utils__/render'
import App from 'App'
import axios from 'axios'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {EVENT_TOKEN_KEY} from 'Event/auth'
import {fakeFiftyBlog} from 'Event/template/FiftyBlog/__utils__/factory'

const mockGet = axios.get as jest.Mock
const mockPost = axios.post as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should re-login with a new token', async () => {
  const newAttendee = fakeAttendee({has_password: false})

  const newLoginToken = 'newlogintoken'

  visitEventSite({
    event: fakeEvent({
      template: fakeFiftyBlog(),
    }),
    pathname: '/login',
    search: `?token=${newLoginToken}`,
  })

  // Already authenticated
  window.localStorage.setItem(EVENT_TOKEN_KEY, 'some_existing_token')

  // Attempted to login via new token
  mockPost.mockImplementationOnce(() =>
    Promise.resolve({data: {access_token: 'new_auth_token'}}),
  )

  // Logged in as new user
  mockGet.mockImplementationOnce(() => Promise.resolve({data: newAttendee}))

  const {findByLabelText} = render(<App />)

  /**
   * Since the new user doesn't have their password set, we expect
   * to be at the create password step.
   */
  expect(await findByLabelText('password input')).toBeInTheDocument()

  const [loginUrl, loginData] = mockPost.mock.calls[0]
  expect(loginUrl).toMatch('/login')

  expect(loginData.login_token).toBe(newLoginToken)
})
