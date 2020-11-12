import {isProduction, appRoot} from 'App'
import {Organization} from 'obvio/user/Organizations/organizations-client'

export function organizationUrl(organization: Organization) {
  const scheme = isProduction ? 'https://' : 'http://'
  return `${scheme}${organization.slug}.${appRoot}`
}

/**
 * Parses the organization slug from the url
 */
export function slugFromURL() {
  const host = window.location.host
  const root = appRoot ? `.${appRoot}` : ''
  return host.replace(root, '')
}
