import {useAuthClient} from 'auth/auth-client'
import {Organization} from 'organization'
import {useOrganization} from 'organization/OrganizationProvider'

export const organizationTokenKey = (slug: Organization['slug']) =>
  `__obvio_org_${slug}_user_token__`

export const useOrganizationAuth = () => {
  const {organization} = useOrganization()
  const baseUrl = `/organizations/${organization.slug}`

  return useAuthClient({
    tokenKey: organizationTokenKey(organization.slug),
    endpoints: {
      user: `${baseUrl}/user`,
      login: `${baseUrl}/login`,
      register: `/register`,
    },
  })
}
