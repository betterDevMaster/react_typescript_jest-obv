import {useParams} from 'react-router-dom'

export function useEventRoutes() {
  const {event} = useParams<{event: string}>()

  return {
    dashboard: `/${event}/dashboard`,
  }
}
