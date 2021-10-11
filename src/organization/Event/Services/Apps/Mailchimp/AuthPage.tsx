import Page from 'organization/Event/Page'
import Layout from 'organization/user/Layout'
import React, {useEffect, useState} from 'react'
import {useEvent} from 'Event/EventProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import {MailchimpIntegration} from 'organization/Event/Services/Apps/Mailchimp/index'
import {useServices} from 'organization/Event/Services/ServicesProvider'
import {useIsMounted} from 'lib/dom'
import {useEventRoutes} from 'organization/Event/EventRoutes'
import {useRedirectUrl} from 'organization/Event/Services/Apps/Mailchimp/LinkPage'
import {useLocation} from 'react-router-dom'
import {useHistory} from 'react-router'
import {RelativeLink} from 'lib/ui/link/RelativeLink'

export default function AuthPage(props: {authCode: string}) {
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [failed, setFailed] = useState(false)
  const completeAuth = useCompleteAuth()
  const {update: updateIntegration} = useServices()
  const {authCode} = props
  const isMounted = useIsMounted()
  const routes = useEventRoutes()
  const location = useLocation()
  const history = useHistory()

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
  }, [
    authCode,
    completeAuth,
    hasSubmitted,
    updateIntegration,
    isMounted,
    routes,
    history,
    location,
  ])

  if (failed) {
    return (
      <Layout>
        <Page>
          <p>Error: could not authenticate with Mailchimp</p>
          <p>
            <RelativeLink to={routes.services.mailchimp}>
              Click here
            </RelativeLink>{' '}
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
  const url = api(`/events/${event.slug}/integrations/mailchimp/auth`)

  const redirectUrl = useRedirectUrl()

  return (authCode: string) =>
    client.post<MailchimpIntegration>(url, {
      auth_code: authCode,
      redirect_url: redirectUrl,
    })
}
