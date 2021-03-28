import React from 'react'
import axios from 'axios'
import faker from 'faker'
import {render} from '__utils__/render'
import App from 'App'
import user from '@testing-library/user-event'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import {signInToOrganization} from 'organization/__utils__/authenticate'
import {UPDATE_TEAM} from 'organization/PermissionsProvider'
import {queryByLabelText} from '@testing-library/dom'
import {act} from '@testing-library/react'

const mockGet = axios.get as jest.Mock
const mockPost = axios.post as jest.Mock

it('should add a new team member', async () => {
  const authUser = fakeTeamMember()
  signInToOrganization({
    authUser,
    owner: authUser,
    userPermissions: [UPDATE_TEAM],
  })

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

it('should check permissions', async () => {
  const authUser = fakeTeamMember()
  signInToOrganization({
    authUser,
    owner: authUser,
  })

  const teamMembers = Array.from(
    {
      length: faker.random.number({min: 1, max: 5}),
    },
    fakeTeamMember,
  )

  const {findByText, queryByLabelText} = render(<App />)

  expect(await findByText(/team/i)).toBeInTheDocument()
  mockGet.mockImplementationOnce(() => Promise.resolve({data: teamMembers})) // team members

  await act(async () => {
    user.click(await findByText(/team/i))
  })

  expect(queryByLabelText('add team member')).not.toBeInTheDocument()
})
