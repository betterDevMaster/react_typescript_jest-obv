import Typography from '@material-ui/core/Typography'
import {AbsoluteLink} from 'lib/ui/link/AbsoluteLink'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useEventRoutes} from 'organization/Event/EventRoutes'
import Page from 'organization/Event/Page'
import Layout from 'organization/user/Layout'
import React from 'react'

export default function Zapier() {
  const routes = useEventRoutes()

  return (
    <Layout>
      <Page>
        <Typography variant="h4">Zapier</Typography>
        <Typography variant="subtitle1">Steps to link</Typography>
        <ol>
          <li>
            Open{' '}
            <AbsoluteLink newTab to="https://zapier.com/">
              Zapier.com
            </AbsoluteLink>
          </li>
          <li>Go to My Apps</li>
          <li>Click Add connection</li>
          <li>Find and click to OBVIO (2.0.0)</li>
          <li>
            Provide an access token from the{' '}
            {<RelativeLink to={routes.services.root}>services</RelativeLink>}{' '}
            page.
          </li>
          <li>Click to "Yes, Continue"</li>
          <li>You are ready to create your first ZAP</li>
        </ol>
      </Page>
    </Layout>
  )
}