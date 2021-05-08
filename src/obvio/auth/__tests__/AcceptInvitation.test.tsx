import React from 'react'
import user from '@testing-library/user-event'
import faker from 'faker'
import App from 'App'
import {render} from '__utils__/render'
import axios from 'axios'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import {wait} from '@testing-library/dom'
import {useLocation} from 'react-router-dom'
import {fakeUser} from 'auth/user/__utils__/factory'

const mockPost = axios.post as jest.Mock
const mockGet = axios.get as jest.Mock
const mockUseLocation = useLocation as jest.Mock

it('should create an account', async () => {
  const token = faker.random.alphaNumeric(8)

  const pathname = '/accept_invitation'
  const search = `?token=${token}`

  Object.defineProperty(window, 'location', {
    value: {
      host: 'app.obv.io',
      pathname,
      search,
      hash: '',
    },
  })

  mockUseLocation.mockImplementation(() => ({
    pathname,
    search,
    hash: '',
  }))

  const {findByLabelText, findByText} = render(<App />)

  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()
  const password = faker.random.alphaNumeric(10)
  user.type(await findByLabelText('first name'), firstName)
  user.type(await findByLabelText('last name'), lastName)
  user.type(await findByLabelText('password'), password)
  user.type(await findByLabelText('password confirmation'), password)

  const teamMember = fakeTeamMember()
  mockPost.mockImplementationOnce(() => Promise.resolve({data: teamMember}))

  // Logs in on successful accept
  mockPost.mockImplementationOnce(() =>
    Promise.resolve({data: {access_token: faker.random.alphaNumeric(8)}}),
  )

  // Gets a user on login
  mockGet.mockImplementationOnce(() => Promise.resolve({data: fakeUser()}))

  user.click(await findByLabelText('create account'))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(2)
  })

  const [url, data] = mockPost.mock.calls[0]

  // Check url, and data on accept
  expect(url).toMatch(`/team_invitations/accept`)
  expect(data).toMatchObject({
    first_name: firstName,
    last_name: lastName,
    password,
    password_confirmation: password,
    token,
  })

  await wait(() => {
    expect(mockGet).toHaveBeenCalledTimes(2)
  })

  expect(await findByText('Logout')).toBeInTheDocument()
})
