import {AuthClientSettings, useAuthClient} from 'auth/auth-client'
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
