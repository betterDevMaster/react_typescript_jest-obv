import {useAuthClient} from 'auth/auth-client'

export const useOrganizationAuth = (organizationSlug: string) =>
  useAuthClient({
    endpoints: {
      user: `/organizations/${organizationSlug}/user`,
      login: `/organizations/${organizationSlug}/login`,
      register: `/register`,
    },
  })
