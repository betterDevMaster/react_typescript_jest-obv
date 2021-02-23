import {useAuthClient} from 'auth/auth-client'
import {User} from 'auth/user'
import {Organization} from 'organization'
import {useOrganization} from 'organization/OrganizationProvider'
import {useMemo} from 'react'

export const organizationTokenKey = (slug: Organization['slug']) =>
  `__obvio_org_${slug}_user_token__`

export const useOrganizationAuth = () => {
  const {organization} = useOrganization()
  const baseUrl = `/organizations/${organization.slug}`

  const settings = useMemo(
    () => ({
      tokenKey: organizationTokenKey(organization.slug),
      endpoints: {
        user: `${baseUrl}/user`,
        login: `${baseUrl}/login`,
        register: `/register`,
      },
    }),
    [baseUrl, organization],
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
