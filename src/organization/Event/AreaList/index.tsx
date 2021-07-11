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
import {
  CHECK_IN_ATTENDEES,
  CONFIGURE_EVENTS,
  START_ROOMS,
  usePermissions,
} from 'organization/PermissionsProvider'

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
  const {can} = usePermissions()

  if (loading || !areas) {
    return <div>loading...</div>
  }

  const isEmpty = areas.length === 0
  if (isEmpty) {
    return <div>No areas have been created</div>
  }

  const visibleAreas = areas.filter((a) => {
    if (can(START_ROOMS) || can(CONFIGURE_EVENTS)) {
      return true
    }

    /**
     * If a user only has permission to check in attendees (tech check agent), then
     * we'll only show the tech check area.
     */
    if (can(CHECK_IN_ATTENDEES)) {
      return a.is_tech_check
    }

    return false
  })

  return (
    <div>
      {visibleAreas.map((a) => (
        <Card key={a.id} area={a} />
      ))}
    </div>
  )
}
