import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import {useEvent} from 'Event/EventProvider'
import {api, obvioUrl} from 'lib/url'
import {useEventRoutes} from 'organization/Event/EventRoutes'
import Page from 'organization/Event/Page'
import {useOrganization} from 'organization/OrganizationProvider'
import Layout from 'organization/user/Layout'
import React, {useState} from 'react'

export default function LinkPage() {
  const {link, isProcessing} = useLink()

  return (
    <Layout>
      <Page>
        <Typography variant="h4">Keap</Typography>
        <p>
          Click the button below to link obv.io with Keap.
          <br />
          You will be redirected to Keap to complete authorization.
        </p>
        <Button
          color="primary"
          variant="contained"
          disabled={isProcessing}
          onClick={link}
          aria-label="authorize"
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
  const redirectUrl = useRedirectUrl()

  const linkUrl = api(`/events/${event.slug}/integrations/infusionsoft/link`)

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
        // Redirect to Infusionsoft
        window.location.href = auth_url
      })
  }

  return {link, isProcessing}
}

export function useRedirectUrl() {
  const routes = useEventRoutes()
  return obvioUrl(routes.services.infusionsoft)
}
