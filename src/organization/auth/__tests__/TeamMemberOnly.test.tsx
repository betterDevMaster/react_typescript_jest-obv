import {setObvioAppUrl} from 'organization/__utils__/authenticate'
import React from 'react'
import faker from 'faker'
import {fakeOrganization} from 'obvio/Organizations/__utils__/factory'
import {useLocation} from 'react-router-dom'
import axios from 'axios'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import {TEAM_MEMBER_TOKEN_KEY} from 'obvio/auth'
import {render} from '__utils__/render'
import App from 'App'

const mockUseLocation = useLocation as jest.Mock
const mockGet = axios.get as jest.Mock

it('should show team member only page', async () => {
  setObvioAppUrl()

  const organization = fakeOrganization()
  const token = faker.random.alphaNumeric(8)
  // is already logged in user
  window.localStorage.setItem(TEAM_MEMBER_TOKEN_KEY, token)
  mockUseLocation.mockImplementation(() => ({
    pathname: `/organization/${organization.id}`,
  }))

  // Is valid organization slug
  mockGet.mockImplementationOnce(() => Promise.resolve({data: organization}))
  // Authenticated
  mockGet.mockImplementationOnce(() =>
    Promise.resolve({data: fakeTeamMember()}),
  )
  // Couldn't fetch owner...
  mockGet.mockImplementationOnce(() =>
    Promise.reject({data: {message: 'Unauthorized'}}),
  )

  const {findByText} = render(<App />)

  expect(await findByText('Team Members Only')).toBeInTheDocument()
})
