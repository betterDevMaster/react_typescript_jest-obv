import {appRoot, isProduction} from 'index'
import {Organization} from 'obvio/user/Organizations/organizations-client'

export function organizationUrl(organization: Organization) {
  const scheme = isProduction ? 'https://' : 'http://'
  return `${scheme}${organization.slug}.${appRoot}`
}
