import React, {useEffect} from 'react'
import {useQueryParams} from 'lib/url'
import {useEventRoutes} from 'organization/Event/EventRoutes'
import {useHistory} from 'react-router-dom'

/**
 * Local storage key to store the actual event auth route.
 */
const MAILCHIMP_EVENT_AUTH_ROUTE_KEY = '__mailchimp_auth_event__'

export default function AuthCallbackHandler() {
  const path = loadEventAuthRoute()
  const history = useHistory()

  const {code} = useQueryParams()

  useEffect(() => {
    if (!path) {
      return
    }

    /**
     * Redirect to event-specific auth route
     */
    const withCode = `${path}?code=${code}`
    history.push(withCode)
  }, [history, path, code])

  if (!path) {
    return <div>Authentication failed - route not set.</div>
  }

  return null
}

/**
 * Mailchimp only accepts a single redirect URI, so we need to store
 * the event specific auth route in local storage, and read it
 * in the callback.
 *
 * @returns
 */
export function useSetEventAuthRoute() {
  const routes = useEventRoutes()
  const path = routes.services.mailchimp

  return () => {
    window.localStorage.setItem(MAILCHIMP_EVENT_AUTH_ROUTE_KEY, path)
  }
}

function loadEventAuthRoute() {
  return window.localStorage.getItem(MAILCHIMP_EVENT_AUTH_ROUTE_KEY)
}
