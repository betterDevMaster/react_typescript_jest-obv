import {appRoot} from 'App'
import {Organization} from 'organization'

export function setUrlForOrganization(organization: Organization) {
  Object.defineProperty(window, 'location', {
    value: {
      host: `${organization.slug}.${appRoot}`,
    },
  })
}
