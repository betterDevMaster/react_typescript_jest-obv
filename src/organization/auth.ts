import {useAuthClient} from 'auth/auth-client'
import {slugFromURL} from 'organization/url'

export const useOrganizationAuth = () => {
  const organization = slugFromURL()

  return useAuthClient({
    endpoints: {
      user: `/organizations/${organization}/user`,
      login: `/organizations/${organization}/login`,
      register: `/register`,
    },
  })
}
