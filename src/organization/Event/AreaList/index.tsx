import React from 'react'
import Card from 'organization/Event/AreaList/Card'
import {useAreas} from 'organization/Event/AreasProvider'
import Button from '@material-ui/core/Button'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useEvent} from 'Event/EventProvider'
import Layout from 'organization/user/Layout'
import {useEventRoutes} from 'organization/Event/EventRoutes'
import {useBreadcrumbs} from 'lib/ui/BreadcrumbProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import Page from 'organization/Event/Page'
import HasPermission from 'organization/HasPermission'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'

export default function AreaList() {
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
        <HasPermission permission={CONFIGURE_EVENTS}>
          <RelativeLink disableStyles to={routes.areas.create}>
            <Button
              variant="contained"
              color="primary"
              aria-label="create area"
            >
              Create Area
            </Button>
          </RelativeLink>
        </HasPermission>
      }
    >
      <Page>
        <Areas />
      </Page>
    </Layout>
  )
}

function Areas() {
  const {areas, loading} = useAreas()

  if (loading || !areas) {
    return <div>loading...</div>
  }

  const isEmpty = areas.length === 0
  if (isEmpty) {
    return <div>You have not created any areas</div>
  }

  return (
    <div>
      {areas.map((a) => (
        <Card key={a.id} area={a} />
      ))}
    </div>
  )
}
