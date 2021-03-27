import {AuthClientSettings, useAuthClient} from 'auth/auth-client'
import {User} from 'auth/user'
import {TEAM_MEMBER_TOKEN_KEY} from 'obvio/auth'
import {useOrganization} from 'organization/OrganizationProvider'
import {useMemo} from 'react'

export const useOrganizationAuth = () => {
  const {organization} = useOrganization()
  const baseUrl = `/organizations/${organization.slug}`

  const settings: AuthClientSettings = useMemo(
    () => ({
      tokenKey: TEAM_MEMBER_TOKEN_KEY,
      endpoints: {
        user: `${baseUrl}/user`,
        login: `${baseUrl}/login`,
        register: `/register`,
      },
      noCache: true,
    }),
    [baseUrl],
  )

  return useAuthClient(settings)
}

function isTeamMember(user: User | null): user is User {
  if (!user) {
    return false
  }

  const hasWaiver = Object.prototype.hasOwnProperty.call(user, 'waiver')
  return !hasWaiver
}

export function useTeamMember() {
  const {user} = useOrganizationAuth()

  if (!user) {
    throw new Error(`Missing user; was useTeamMember called in a guest route?`)
  }

  if (!isTeamMember(user)) {
    throw new Error(`Invalid user; expected a team member.`)
  }

  return user
}
