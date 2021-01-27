import Button from '@material-ui/core/Button'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useEvent} from 'Event/EventProvider'
import React from 'react'
import Layout from 'organization/user/Layout'
import AreaList from 'organization/Event/AreaList'
import {useEventRoutes} from 'organization/Event/EventRoutes'
import {useBreadcrumbs} from 'lib/ui/BreadcrumbProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import Page from 'organization/Event/Page'

export default function Event() {
  const routes = useEventRoutes()
  const {event} = useEvent()
  const {routes: organizationRoutes} = useOrganization()

  useBreadcrumbs([
    {title: 'Events', url: organizationRoutes.events.root},
    {title: event.name, url: routes.root},
  ])

  return (
    <Layout
      navbarRight={
        <RelativeLink disableStyles to={routes.areas.create}>
          <Button variant="contained" color="primary" aria-label="create area">
            Create Area
          </Button>
        </RelativeLink>
      }
    >
      <Page>
        <AreaList />
      </Page>
    </Layout>
  )
}
