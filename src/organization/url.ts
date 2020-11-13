import {isProduction, appRoot} from 'App'
import {Organization} from 'organization/organizations-client'

export function organizationUrl(organization: Organization) {
  const scheme = isProduction ? 'https://' : 'http://'
  return `${scheme}${organization.slug}.${appRoot}`
}

/**
 * Parses the organization slug from the url
 */
export function organizationSlug() {
  const host = window.location.host
  const root = appRoot ? `.${appRoot}` : ''
  return host.replace(root, '')
}
