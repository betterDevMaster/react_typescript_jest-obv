import {deleteToken} from 'auth/token'
import {EVENT_TOKEN_KEY} from 'Event/auth'
import {eventRoutes} from 'Event/Routes'
import FullPageLoader from 'lib/ui/layout/FullPageLoader'
import {useQueryParams} from 'lib/url'
import React, {useEffect, useState} from 'react'
import {useHistory, useLocation} from 'react-router-dom'

/**
 * Handle any authentication tokens, including login, or room
 * registration tokens. If any token is provided we must
 * attempt as an unauthenticated guest.
 *
 * @param props
 * @returns
 */
export default function AuthTokenHandler(props: {
  children: React.ReactElement
}) {
  const location = useLocation()
  const history = useHistory()

  const {token} = useQueryParams()
  const hasToken = Boolean(token)

  /**
   * Routes that accept a token when authenticating.
   */
  const authRoutes = [eventRoutes.login, eventRoutes.room]
  /**
   * Sometimes the pathname may have a trailing '/' which would
   * cause the match to fail, so we'll replace it here.
   */
  const route = location.pathname.replace(/\/$/, '')
  const isAuthRoute = authRoutes.includes(route)

  const shouldAuthenticate = isAuthRoute && hasToken
  const [processing, setProcessing] = useState(shouldAuthenticate)

  useEffect(() => {
    if (!processing || !token) {
      return
    }

    /**
     * If we're attemping to re-authenticate via some token, we'll need
     * to remove any existing user token. Since this is before any
     * auth is checked, the app will start as 'unauthenticated'.
     */
    deleteToken(EVENT_TOKEN_KEY)
    setProcessing(false)
  }, [token, processing, history])

  if (processing) {
    return <FullPageLoader />
  }

  return props.children
}
