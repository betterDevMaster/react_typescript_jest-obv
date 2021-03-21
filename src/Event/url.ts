import {getSubdomain} from 'lib/url'
import {useParams} from 'react-router-dom'

export function domainEventSlug() {
  return getSubdomain(window.location.host)
}

export function useParamEventSlug() {
  const {event} = useParams<{event: string}>()
  return event
}
