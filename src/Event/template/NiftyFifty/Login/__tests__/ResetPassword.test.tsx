import {act} from '@testing-library/react'
import user from '@testing-library/user-event'
import axios from 'axios'
import faker from 'faker'
import React from 'react'
import {render} from '__utils__/render'
import {fakeOrganization} from 'obvio/Organizations/__utils__/factory'
import {useLocation} from 'react-router-dom'
import App from 'App'
import {appRoot} from 'env'
import {fakeEvent} from 'Event/__utils__/factory'
import {fakeNiftyFifty} from 'Event/template/NiftyFifty/__utils__/factory'

const mockGet = axios.get as jest.Mock
const mockPost = axios.post as jest.Mock
const mockUseLocation = useLocation as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should reset the user password', async () => {
  const event = fakeEvent({template: fakeNiftyFifty()})
  const email = faker.internet.email()
  const token = 'secrettoken'
  const password = 'mypw'
  const organization = fakeOrganization()

  const pathname = '/reset_password'
  const search = `?email=${email}&token=${token}`
  mockUseLocation.mockImplementation(() => ({
    pathname,
    search,
  }))

  // react-router uses the history.location to determine the URL to match the Route paths...
  Object.defineProperty(window, 'location', {
    value: {
      host: `${event.slug}.${appRoot}`,
      pathname,
      search,
      hash: '',
    },
  })

  mockGet.mockImplementationOnce(() => Promise.resolve({data: event}))

  const {findByLabelText} = render(<App />, {
    organization: organization,
    event: event,
  })

  expect(await findByLabelText('event account password')).toBeInTheDocument()
  expect(
    await findByLabelText('event account password confirmation'),
  ).toBeInTheDocument()

  user.type(await findByLabelText('event account password'), password)
  user.type(
    await findByLabelText('event account password confirmation'),
    password,
  )

  mockPost.mockImplementationOnce(() => Promise.resolve({data: 'ok'}))

  await act(async () => {
    user.click(await findByLabelText('submit reset password'))
  })

  expect(mockPost).toHaveBeenCalledTimes(1)

  const [url, data] = mockPost.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}/reset_password`)
  expect(await findByLabelText('back to login')).toBeInTheDocument()

  expect(data.token).toBe(token)
  expect(data.email).toBe(email)
  expect(data.password).toBe(password)
  expect(data.password_confirmation).toBe(password)
})
