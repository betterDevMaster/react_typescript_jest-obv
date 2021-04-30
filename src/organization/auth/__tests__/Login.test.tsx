import App from 'App'
import faker from 'faker'
import React from 'react'
import {render} from '__utils__/render'
import user from '@testing-library/user-event'
import mockAxios from 'axios'
import {fakeUser} from 'auth/user/__utils__/factory'
import {act} from '@testing-library/react'
import {fakeOrganization} from 'obvio/Organizations/__utils__/factory'
import {useLocation} from 'react-router-dom'
import {TEAM_MEMBER_TOKEN_KEY} from 'obvio/auth'
import {ALL_PERMISSIONS} from 'organization/__utils__/factory'
import {setObvioAppUrl} from 'organization/__utils__/authenticate'

const mockPost = mockAxios.post as jest.Mock
const mockGet = mockAxios.get as jest.Mock
const mockUseLocation = useLocation as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should show the organization login form', async () => {
  setObvioAppUrl()
  const organization = fakeOrganization()
  mockUseLocation.mockImplementation(() => ({
    pathname: `/organization/${organization.slug}`,
  }))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: organization}))

  const {findByLabelText, findByText} = render(<App />)

  expect(await findByText(new RegExp(organization.name)))
  expect(await findByLabelText(`email`)).toBeInTheDocument()
  expect(await findByLabelText(`password`)).toBeInTheDocument()

  expect(mockGet).toHaveBeenCalledTimes(1)
  const url = mockGet.mock.calls[0][0]
  expect(url).toBe(
    `${process.env.REACT_APP_API_URL}/organizations/${organization.slug}`,
  )
})

it('should login a user', async () => {
  setObvioAppUrl()
  const organization = fakeOrganization()
  mockUseLocation.mockImplementation(() => ({
    pathname: `/organization/${organization.slug}`,
  }))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: organization}))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: fakeUser()}))

  const token = 'secrettoken'
  mockPost.mockImplementationOnce(() =>
    Promise.resolve({data: {access_token: token}}),
  )
  mockGet.mockImplementationOnce(() => Promise.resolve({data: fakeUser()})) // Owner
  mockGet.mockImplementationOnce(() => Promise.resolve({data: []})) // user permissions
  mockGet.mockImplementationOnce(() => Promise.resolve({data: ALL_PERMISSIONS})) // all permissions

  const {findByLabelText, findByText} = render(<App />)

  const email = faker.internet.email()
  const password = 'secretpw'
  user.type(await findByLabelText('email'), email)
  user.type(await findByLabelText('password'), password)

  mockGet.mockImplementationOnce(() => Promise.resolve({data: []})) // events

  await act(async () => {
    user.click(await findByLabelText('submit login'))
  })

  expect(mockPost).toHaveBeenCalledTimes(1)

  // Submitted correct data?
  const data = mockPost.mock.calls[0][1]
  expect(data.email).toBe(email)
  expect(data.password).toBe(password)

  // token saved
  expect(window.localStorage.getItem(TEAM_MEMBER_TOKEN_KEY)).toBe(token)

  // Requested user?
  const authHeader = mockGet.mock.calls[2][1]['headers']['Authorization']
  expect(authHeader).toBe(`Bearer ${token}`)

  expect(await findByText('Logout')).toBeInTheDocument()
})
