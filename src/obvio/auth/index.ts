import {AuthClientSettings, useAuthClient} from 'auth/auth-client'
import {useMemo} from 'react'

export const OBVIO_TOKEN_KEY = '__obvio_user_token__'

export const useObvioAuth = () => {
  const settings: AuthClientSettings = useMemo(
    () => ({
      tokenKey: OBVIO_TOKEN_KEY,
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
