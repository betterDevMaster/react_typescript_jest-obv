import React from 'react'
import axios from 'axios'
import faker from 'faker'
import {render} from '__utils__/render'
import App from 'App'
import user from '@testing-library/user-event'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import {signInToOrganization} from 'organization/__utils__/authenticate'
import {UPDATE_TEAM} from 'organization/PermissionsProvider'

const mockGet = axios.get as jest.Mock

it('should show team members', async () => {
  signInToOrganization({
    userPermissions: [UPDATE_TEAM],
  })

  const teamMembers = Array.from(
    {
      length: faker.random.number({min: 1, max: 5}),
    },
    fakeTeamMember,
  )

  const {findByLabelText, findAllByLabelText} = render(<App />)

  mockGet.mockImplementationOnce(() => Promise.resolve({data: teamMembers})) // team members
  user.click(await findByLabelText('team link'))

  expect((await findAllByLabelText('team member')).length).toBe(
    teamMembers.length,
  )
})
