import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Page from 'organization/Event/Page'
import Layout from 'organization/user/Layout'
import React, {useState} from 'react'
import {useOrganization} from 'organization/OrganizationProvider'
import {useEvent} from 'Event/EventProvider'
import {api, obvioUrl} from 'lib/url'
import ErrorAlert from 'lib/ui/alerts/ErrorAlert'
import {obvioRoutes} from 'obvio/Routes'
import {useSetEventAuthRoute} from 'organization/Event/Services/Apps/Mailchimp/AuthCallbackHandler'

export default function LinkPage() {
  const {link, isProcessing, error} = useLink()

  return (
    <Layout>
      <Page>
        <Typography variant="h4">Mailchimp</Typography>
        <p>
          Click the button below to link obv.io with Mailchimp.
          <br />
          You will be redirected to Mailchimp to complete authorization.
        </p>
        <ErrorAlert>{error}</ErrorAlert>
        <Button
          color="primary"
          variant="contained"
          aria-label="authorize"
          disabled={isProcessing}
          onClick={link}
        >
          Authorize
        </Button>
      </Page>
    </Layout>
  )
}

function useLink() {
  const {client} = useOrganization()
  const {event} = useEvent()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const redirectUrl = useRedirectUrl()
  const setEventAuthRoute = useSetEventAuthRoute()

  const linkUrl = api(`/events/${event.slug}/integrations/mailchimp/link`)

  const link = () => {
    if (isProcessing) {
      return
    }

    setIsProcessing(true)
    client
      .post<{auth_url: string}>(linkUrl, {
        redirect_url: redirectUrl,
      })
      .then(({auth_url}) => {
        // Redirect to Mailchimp
        window.location.href = auth_url
        setEventAuthRoute()
      })
      .catch((e) => {
        setError(e.message)
        setIsProcessing(false)
      })
  }

  return {link, isProcessing, error}
}

/**
 * Mailchimp only accepts a single Redirect URL that's registered at the
 * app level, so we need to specify a top-level/obvio route.
 *
 * @returns
 */
export function useRedirectUrl() {
  return `${obvioUrl(obvioRoutes.mailchimp.auth)}`
}
