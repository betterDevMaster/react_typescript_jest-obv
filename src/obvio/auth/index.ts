import {useAuthClient} from 'auth/auth-client'

export const OBVIO_TOKEN_KEY = '__obvio_user_token__'
export const OBVIO_ORG_TOKEN_KEY = '__obvio_org_sage_user_token__'

export const useObvioAuth = () =>
  useAuthClient({
    tokenKey: OBVIO_TOKEN_KEY,
    endpoints: {
      user: '/user',
      login: '/login',
      register: '/register',
    },
  })
