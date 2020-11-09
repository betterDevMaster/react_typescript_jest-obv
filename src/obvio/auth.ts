import {useAuthClient} from 'auth/auth-client'

export const useObvioAuth = () =>
  useAuthClient({
    endpoints: {
      user: '/team/user',
      login: '/team/login',
    },
  })
