import {useAuthClient} from 'auth/auth-client'
import {organizationSlug} from 'organization/url'

export const useOrganizationAuth = () => {
  const organization = organizationSlug()

  return useAuthClient({
    endpoints: {
      user: `/organizations/${organization}/user`,
      login: `/organizations/${organization}/login`,
      register: `/register`,
    },
  })
}
