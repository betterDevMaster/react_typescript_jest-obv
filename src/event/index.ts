import {appRoot, isProduction} from 'App'
import {Dashboard} from 'event/Dashboard'
import {getSubdomain} from 'lib/url'

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
