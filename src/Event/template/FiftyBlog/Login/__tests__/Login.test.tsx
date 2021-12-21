import user from '@testing-library/user-event'
import {fakeLogin} from 'Event/template/SimpleBlog/__utils__/factory'
import {fakeEvent} from 'Event/__utils__/factory'
import {visitEventSite} from 'Event/__utils__/url'
import React from 'react'
import faker from 'faker'
import {render} from '__utils__/render'
import App from 'App'
import {act, wait} from '@testing-library/react'
import axios from 'axios'
import {useLocation} from 'react-router-dom'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {defaultScore} from 'Event/PointsProvider'
import {EVENT_TOKEN_KEY} from 'Event/auth'
import {fakeFiftyBlog} from 'Event/template/FiftyBlog/__utils__/factory'

const mockGet = axios.get as jest.Mock
const mockPost = axios.post as jest.Mock
const mockUseLocation = useLocation as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('render login page', async () => {
  const background = faker.internet.url()
  const logo = faker.internet.url()
  const descriptionText = faker.lorem.sentence()

  const event = fakeEvent({
    template: fakeFiftyBlog({
      login: fakeLogin({
        description: {
          text: descriptionText,
          color: '#000000',
          fontSize: 18,
        },
      }),
      loginLogo: logo,
      loginBackground: background,
    }),
  })

  visitEventSite({event})

  const {findByLabelText, findByText} = render(<App />)

  await wait(() => {
    expect(mockGet).toBeCalledTimes(1)
  })
  expect(await findByLabelText('login background')).toHaveStyle(
    `background: url(${background})`,
  )
  expect((await findByLabelText('login logo')).getAttribute('src')).toBe(logo)
  expect(await findByText(descriptionText)).toBeInTheDocument()
})

it('should login a user', async () => {
  visitEventSite({
    event: fakeEvent({
      template: fakeFiftyBlog(),
    }),
  })

  const token = 'secrettoken'
  mockPost.mockImplementationOnce(() =>
    Promise.resolve({data: {access_token: token}}),
  )

  // Attendee on login
  mockGet.mockImplementationOnce(() => Promise.resolve({data: fakeAttendee()}))
  // Dashboard requests
  mockGet.mockImplementationOnce(() => Promise.resolve({data: []}))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: defaultScore}))

  const {findByLabelText, findAllByText} = render(<App />)

  const email = faker.internet.email()
  const password = 'secretpw'
  user.type(await findByLabelText('email'), email)
  user.type(await findByLabelText('password'), password)

  await act(async () => {
    user.click(await findByLabelText('submit login'))
  })

  expect(mockPost).toHaveBeenCalledTimes(1)

  // Submitted correct data?
  const data = mockPost.mock.calls[0][1]
  expect(data.email).toBe(email)
  expect(data.password).toBe(password)

  // token saved
  expect(window.localStorage.getItem(EVENT_TOKEN_KEY)).toBe(token)

  // Requested user?
  const authHeader = mockGet.mock.calls[1][1]['headers']['Authorization']
  expect(authHeader).toBe(`Bearer ${token}`)

  // viewing waiver page
  expect((await findAllByText(/waiver/i)).length).toBeGreaterThan(0)
})

it('should login a user by token', async () => {
  const attendee = fakeAttendee({has_password: false})
  const token = 'logintoken'
  const accessToken = faker.random.alphaNumeric(8)

  visitEventSite({
    event: fakeEvent({
      template: fakeFiftyBlog(),
    }),
  })

  mockUseLocation.mockImplementation(() => ({
    pathname: '',
    search: `?token=${token}`,
  }))

  mockGet.mockImplementationOnce(() => Promise.resolve({data: attendee}))
  // Dashboard requests
  mockGet.mockImplementationOnce(() => Promise.resolve({data: []})) // Custom actions
  mockGet.mockImplementationOnce(() => Promise.resolve({data: defaultScore})) // Custom actions
  // Token auth
  mockPost.mockImplementationOnce(() =>
    Promise.resolve({data: {access_token: accessToken}}),
  )

  const {findByLabelText} = render(<App />)

  expect(await findByLabelText('password input')).toBeInTheDocument()

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  expect(mockPost.mock.calls[0][1]['login_token']).toBe(token)
})

it('should handle an invalid login token', async () => {
  const attendee = fakeAttendee({has_password: false})
  const token = 'logintoken'

  visitEventSite({
    event: fakeEvent({
      template: fakeFiftyBlog(),
    }),
  })

  mockUseLocation.mockImplementation(() => ({
    pathname: '',
    search: `?token=${token}`,
  }))

  mockGet.mockImplementationOnce(() => Promise.resolve({data: attendee}))
  mockPost.mockImplementationOnce(() =>
    Promise.reject({data: {message: 'bad token'}}),
  )

  const {findByLabelText} = render(<App />)

  expect(await findByLabelText(/email/i)).toBeInTheDocument()

  expect(mockPost).toHaveBeenCalledTimes(1)
  expect(mockPost.mock.calls[0][1]['login_token']).toBe(token)
})
