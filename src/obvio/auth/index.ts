import {AuthClientSettings, useAuthClient} from 'auth/auth-client'
import {getToken} from 'auth/token'
import {isTeamMember, TeamMember} from 'auth/user'
import {useMemo} from 'react'

export const TEAM_MEMBER_TOKEN_KEY = '__obvio_team_member_token__'

export const useObvioAuth = () => {
  const settings: AuthClientSettings = useMemo(
    () => ({
      tokenKey: TEAM_MEMBER_TOKEN_KEY,
      endpoints: {
        user: '/user',
        login: '/login',
        register: '/register',
      },
    }),
    [],
  )

  return useAuthClient<TeamMember>(settings)
}

/**
 * Get the currently authenticated team member's auth token.
 *
 * @returns
 */
export function useAuthToken() {
  const token = getToken(TEAM_MEMBER_TOKEN_KEY)
  if (!token) {
    throw new Error(
      'Missing auth token; was useToken called in an unauthenticated route?',
    )
  }

  return token
}

export function useObvioUser() {
  const {user} = useObvioAuth()

  if (!user) {
    throw new Error(
      `Missing user; was useObvioUser called outside of an authenticated route?`,
    )
  }

  if (!isTeamMember(user)) {
    throw new Error(`Invalid user; expected a team member.`)
  }

  return user
}
