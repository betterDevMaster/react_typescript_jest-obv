import {useAuthClient} from 'auth/auth-client'

export const useObvioAuth = () =>
  useAuthClient({
    endpoints: {
      user: '/user',
      login: '/login',
      register: '/register',
    },
  })
