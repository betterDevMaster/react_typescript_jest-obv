import {TeamMember} from 'auth/user'
import React from 'react'
import user from '@testing-library/user-event'
import {UPDATE_TEAM} from 'organization/PermissionsProvider'
import {Role} from 'organization/Team/Roles/RolesProvider'
import {TeamInvitation} from 'organization/Team/TeamInvitationsProvider'
import {
  signInToOrganization,
  SignInToOrganizationOptions,
} from 'organization/__utils__/authenticate'
import {render} from '__utils__/render'
import axios from 'axios'
import App from 'App'

const mockGet = axios.get as jest.Mock

export async function goToTeams(
  options: SignInToOrganizationOptions & {
    teamMembers?: TeamMember[]
    teamInvitations?: TeamInvitation[]
    roles?: Role[]
  } = {},
) {
  const teamMembers = options?.teamMembers || []
  const invitations = options?.teamInvitations || []
  const roles = options?.roles || []

  const userInfo = signInToOrganization({
    ...options,
    userPermissions: [UPDATE_TEAM],
  })

  const context = render(<App />)

  mockGet.mockImplementationOnce(() => Promise.resolve({data: teamMembers})) // team members
  mockGet.mockImplementationOnce(() => Promise.resolve({data: invitations})) // invitations
  mockGet.mockImplementationOnce(() => Promise.resolve({data: roles}))

  user.click(await context.findByLabelText('team link'))

  return {...context, ...userInfo}
}
