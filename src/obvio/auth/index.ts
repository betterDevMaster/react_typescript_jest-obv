import {AuthClientSettings, useAuthClient} from 'auth/auth-client'
import {isTeamMember} from 'auth/user'
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
      noCache: true,
    }),
    [],
  )

  return useAuthClient(settings)
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
