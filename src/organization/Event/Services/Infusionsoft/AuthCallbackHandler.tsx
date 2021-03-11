import {useEvent} from 'Event/EventProvider'
import {AbsoluteLink} from 'lib/ui/link/AbsoluteLink'
import {api} from 'lib/url'
import {useEventRoutes} from 'organization/Event/EventRoutes'
import Page from 'organization/Event/Page'
import {InfusionsoftIntegration} from 'organization/Event/Services/Infusionsoft'
import {useServices} from 'organization/Event/Services/ServicesProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import Layout from 'organization/user/Layout'
import React, {useEffect, useState} from 'react'

export default function AuthCallbackHandler(props: {authCode: string}) {
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [failed, setFailed] = useState(false)
  const completeAuth = useCompleteAuth()
  const {updateIntegration} = useServices()
  const {authCode} = props

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
        setFailed(true)
      })
  }, [authCode, completeAuth, hasSubmitted, updateIntegration])

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

  return (authCode: string) =>
    client.post<InfusionsoftIntegration>(url, {
      auth_code: authCode,
    })
}
