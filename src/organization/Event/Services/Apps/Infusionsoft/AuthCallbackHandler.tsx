import {useEvent} from 'Event/EventProvider'
import {useIsMounted} from 'lib/dom'
import {AbsoluteLink} from 'lib/ui/link/AbsoluteLink'
import {api} from 'lib/url'
import {useEventRoutes} from 'organization/Event/EventRoutes'
import Page from 'organization/Event/Page'
import {InfusionsoftIntegration} from 'organization/Event/Services/Apps/Infusionsoft'
import {useRedirectUrl} from 'organization/Event/Services/Apps/Infusionsoft/LinkPage'
import {useServices} from 'organization/Event/Services/ServicesProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import Layout from 'organization/user/Layout'
import React, {useEffect, useState} from 'react'

export default function AuthCallbackHandler(props: {authCode: string}) {
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [failed, setFailed] = useState(false)
  const completeAuth = useCompleteAuth()
  const {update: updateIntegration} = useServices()
  const {authCode} = props
  const isMounted = useIsMounted()

  const routes = useEventRoutes()

  useEffect(() => {
    if (hasSubmitted) {
      return
    }

    setHasSubmitted(true)

    completeAuth(authCode)
      .then(updateIntegration)
      .catch((e) => {
        console.error(e)

        if (!isMounted.current) {
          return
        }

        setFailed(true)
      })
  }, [authCode, completeAuth, hasSubmitted, updateIntegration, isMounted])

  if (failed) {
    return (
      <Layout>
        <Page>
          <p>Error: could not authenticate with Infusionsoft</p>
          <p>
            <AbsoluteLink to={routes.services.infusionsoft}>
              Click here
            </AbsoluteLink>{' '}
            to go back.
          </p>
        </Page>
      </Layout>
    )
  }

  return (
    <Layout>
      <Page>
        <div>processing...</div>
      </Page>
    </Layout>
  )
}

function useCompleteAuth() {
  const {event} = useEvent()
  const {client} = useOrganization()
  const url = api(`/events/${event.slug}/integrations/infusionsoft/auth`)
  const redirectUrl = useRedirectUrl()

  return (authCode: string) =>
    client.post<InfusionsoftIntegration>(url, {
      auth_code: authCode,
      redirect_url: redirectUrl,
    })
}
