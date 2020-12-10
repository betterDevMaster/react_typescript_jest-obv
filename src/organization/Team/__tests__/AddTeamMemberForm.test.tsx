import React from 'react'
import {useLocation} from 'react-router-dom'
import axios from 'axios'
import {fakeOrganization} from 'obvio/Organizations/__utils__/factory'
import {fakeUser} from 'auth/user/__utils__/factory'
import faker from 'faker'
import {organizationTokenKey} from 'organization/auth'
import {render} from '__utils__/render'
import App from 'App'
import user from '@testing-library/user-event'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import {signInToOrganization} from 'organization/__utils__/authenticate'

const mockUseLocation = useLocation as jest.Mock
const mockGet = axios.get as jest.Mock
const mockPost = axios.post as jest.Mock

it('add a new team member', async () => {
  const authUser = fakeUser()
  signInToOrganization({authUser, owner: authUser})

  const teamMembers = Array.from(
    {
      length: faker.random.number({min: 1, max: 5}),
    },
    fakeTeamMember,
  )

  const {findByText, findByLabelText} = render(<App />)

  expect(await findByText(/team/i)).toBeInTheDocument()

  mockGet.mockImplementationOnce(() => Promise.resolve({data: teamMembers})) // team members

  user.click(await findByText(/team/i))

  const email = faker.internet.email()
  user.type(await findByLabelText('team member email'), email)

  const addedMember = fakeTeamMember()
  mockPost.mockImplementationOnce(() => Promise.resolve({data: addedMember}))

  user.click(await findByLabelText('add team member'))

  // New member was added to list
  expect(
    await findByText(new RegExp(addedMember.first_name)),
  ).toBeInTheDocument()
})
