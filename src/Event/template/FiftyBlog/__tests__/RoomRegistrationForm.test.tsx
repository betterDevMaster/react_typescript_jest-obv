import React from 'react'
import faker from 'faker'
import user from '@testing-library/user-event'
import {fakeEvent} from 'Event/__utils__/factory'
import {visitEventSite} from 'Event/__utils__/url'
import {render} from '__utils__/render'
import App from 'App'
import axios from 'axios'
import {wait} from '@testing-library/react'
import {EVENT_TOKEN_KEY} from 'Event/auth'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {fakeFiftyBlog} from 'Event/template/FiftyBlog/__utils__/factory'

const mockPost = axios.post as jest.Mock
const mockGet = axios.get as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should launch a zoom meeting', async () => {
  const event = fakeEvent({
    template: fakeFiftyBlog(),
  })
  const token = 'secretregistrationtoken'

  visitEventSite({event, pathname: '/room', search: `?token=${token}`})

  const {findByLabelText} = render(<App />)

  expect(await findByLabelText('first name')).toBeInTheDocument()

  const firstName = faker.name.firstName()
  user.type(await findByLabelText('first name'), firstName)

  const lastName = faker.name.lastName()
  user.type(await findByLabelText('last name'), lastName)

  const email = faker.internet.email()
  user.type(await findByLabelText('email'), email)

  const joinUrl = faker.internet.url()
  mockPost.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        url: joinUrl,
      },
    }),
  )

  user.click(await findByLabelText('join room'))

  await wait(() => {
    expect(window.location.href).toBe(joinUrl)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch('/room/join')

  expect(data.first_name).toBe(firstName)
  expect(data.last_name).toBe(lastName)
  expect(data.email).toBe(email)
  expect(data.token).toBe(token)
})

it('should show form with new token', async () => {
  const event = fakeEvent({
    template: fakeFiftyBlog(),
  })
  const token = 'secretregistrationtoken'

  visitEventSite({event, pathname: '/room', search: `?token=${token}`})

  // Already authenticated
  window.localStorage.setItem(EVENT_TOKEN_KEY, 'some_existing_token')

  // existing user
  mockGet.mockImplementationOnce(() => Promise.resolve({data: fakeAttendee()}))

  const {findByLabelText} = render(<App />)

  expect(await findByLabelText('join room')).toBeInTheDocument()
})
