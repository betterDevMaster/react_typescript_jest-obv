import React from 'react'
import axios from 'axios'
import faker from 'faker'
import {render} from '__utils__/render'
import App from 'App'
import user from '@testing-library/user-event'
import {
  fakeTeamInvitation,
  fakeTeamMember,
} from 'organization/Team/__utils__/factory'
import {wait} from '@testing-library/react'
import {signInToOrganization} from 'organization/__utils__/authenticate'
import {UPDATE_TEAM} from 'organization/PermissionsProvider'
import {goToTeams} from 'organization/Team/__utils__/go-to-teams-page'

const mockGet = axios.get as jest.Mock
const mockDelete = axios.delete as jest.Mock
const mockPost = axios.post as jest.Mock

it('should remove a team member', async () => {
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

  const {findByText, findAllByLabelText, queryByText} = render(<App />)

  expect(await findByText(/team/i)).toBeInTheDocument()

  mockGet.mockImplementationOnce(() => Promise.resolve({data: teamMembers})) // team members
  user.click(await findByText(/team/i))

  expect((await findAllByLabelText('team member')).length).toBe(
    teamMembers.length,
  )

  const targetIndex = faker.random.number({min: 0, max: teamMembers.length - 1})
  const target = teamMembers[targetIndex]

  mockDelete.mockImplementationOnce(() => Promise.resolve({data: target}))

  user.click((await findAllByLabelText('remove team member'))[targetIndex])

  await wait(() => {
    expect(queryByText(new RegExp(target.first_name))).not.toBeInTheDocument()
  })
})

it('should remove a team invitation', async () => {
  const teamInvitations = Array.from(
    {
      length: faker.random.number({min: 2, max: 5}),
    },
    fakeTeamInvitation,
  )

  const {findAllByLabelText, queryByText} = await goToTeams({
    teamInvitations,
  })

  expect((await findAllByLabelText('team invitation')).length).toBe(
    teamInvitations.length,
  )

  const targetIndex = faker.random.number({
    min: 0,
    max: teamInvitations.length - 1,
  })
  const target = teamInvitations[targetIndex]

  mockDelete.mockImplementationOnce(() => Promise.resolve({data: 'ok'}))

  user.click((await findAllByLabelText('remove team invitation'))[targetIndex])

  await wait(() => {
    expect(queryByText(new RegExp(target.email))).not.toBeInTheDocument()
  })

  expect((await findAllByLabelText('team invitation')).length).toBe(
    teamInvitations.length - 1,
  )
})

it('should resend another invitation', async () => {
  const invitation = fakeTeamInvitation()

  const {findByLabelText} = await goToTeams({
    teamInvitations: [invitation],
  })

  mockPost.mockImplementationOnce(() => Promise.resolve({data: 'ok'}))

  user.click(await findByLabelText('resend invitation'))

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url] = mockPost.mock.calls[0]
  expect(url).toMatch(`/team_invitations/${invitation.id}`)
})

it('should show resend error', async () => {
  const invitation = fakeTeamInvitation()

  const {findByLabelText, findByText} = await goToTeams({
    teamInvitations: [invitation],
  })

  const message = 'Wait until next resend'
  mockPost.mockImplementationOnce(() =>
    Promise.reject({
      response: {
        data: {message},
      },
    }),
  )

  user.click(await findByLabelText('resend invitation'))

  expect(await findByText(new RegExp(message))).toBeInTheDocument()
})
