import {useOrganization} from 'organization/OrganizationProvider'
import {appRoot, isProduction} from 'App'
import {Dashboard} from 'event/Dashboard'
import {getSubdomain, replaceRouteParam} from 'lib/url'
import {useParams} from 'react-router-dom'

// Can't use 'Event' because that's already a native DOM type
// for browser events and we'd lose TS safety/import assist.
export interface ObvioEvent {
  id: number
  name: string
  slug: string
  dashboard: null | Dashboard
}

export function eventUrl(event: ObvioEvent) {
  const scheme = isProduction ? 'https://' : 'http://'
  return `${scheme}${event.slug}.${appRoot}`
}

export function domainEventSlug() {
  return getSubdomain(window.location.host)
}

export function useParamEventSlug() {
  const {event} = useParams<{event: string}>()
  return event
}

export function useEventRoutes(event?: ObvioEvent) {
  const {routes: organizationRoutes} = useOrganization()
  const slug = useParamEventSlug()
  const value = event ? event.slug : slug

  return replaceRouteParam(':event', value, organizationRoutes.events[':event'])
}
