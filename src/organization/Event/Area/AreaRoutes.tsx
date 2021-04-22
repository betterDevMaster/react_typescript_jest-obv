import {useOrganization} from 'organization/OrganizationProvider'
import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import CreateAreaForm from 'organization/Event/AreaList/CreateAreaForm'
import {routesWithValue} from 'lib/url'
import {Area as AreaData} from 'organization/Event/AreasProvider'
import Area from 'organization/Event/Area'
import {useEventRoutes} from 'organization/Event/EventRoutes'
import RoomRoutes from 'organization/Event/Room/RoomRoutes'
import {useArea} from 'organization/Event/Area/AreaProvider'
import {useEvent} from 'Event/EventProvider'

export function useAreaRoutes() {
  const {area} = useArea()
  const {event} = useEvent()
  const eventRoutes = useEventRoutes(event)

  return areaRoutes({area, eventRoutes})
}

export function areaRoutes({
  eventRoutes,
  area,
}: {
  eventRoutes: ReturnType<typeof useEventRoutes>
  area: AreaData
}) {
  return routesWithValue(':area', String(area.id), eventRoutes.areas[':area'])
}

export default function AreaRoutes() {
  const {routes} = useOrganization()

  return (
    <Switch>
      <Route path={routes.events[':event'].areas[':area'].rooms.root}>
        <RoomRoutes />
      </Route>
      <Route path={routes.events[':event'].areas.create}>
        <CreateAreaForm />
      </Route>
      <Route path={routes.events[':event'].areas.root}>
        <Area />
      </Route>
      <Redirect to={routes.events[':event'].areas[':area'].root} />
    </Switch>
  )
}
