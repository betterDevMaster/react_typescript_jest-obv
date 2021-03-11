import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import {useEvent} from 'Event/EventProvider'
import {api, absoluteUrl} from 'lib/url'
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
        <Typography variant="h4">Infusionsoft</Typography>
        <p>
          Click the button below to link obv.io with Infusionsoft.
          <br />
          You will be redirected to Infusionsoft to complete authorization.
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
  const routes = useEventRoutes()

  const linkUrl = api(`/events/${event.slug}/integrations/infusionsoft/link`)
  const redirectUrl = absoluteUrl(routes.services.infusionsoft)

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
