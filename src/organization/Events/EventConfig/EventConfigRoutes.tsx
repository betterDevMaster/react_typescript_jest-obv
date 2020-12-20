import DashboardConfig from 'organization/Events/EventConfig/DashboardConfig'
import EventConfig from 'organization/Events/EventConfig'
import WaiverConfig from 'organization/Events/EventConfig/WaiverConfig'
import {useOrganization} from 'organization/OrganizationProvider'
import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'

export default function EventConfigRoutes() {
  const {routes} = useOrganization()

  return (
    <Switch>
      <Route path={routes.events[':event'].root} exact>
        <EventConfig />
      </Route>
      <Route path={routes.events[':event'].dashboard}>
        <DashboardConfig />
      </Route>
      <Route path={routes.events[':event'].waiver}>
        <WaiverConfig />
      </Route>
      <Redirect to={routes.events[':event'].root} />
    </Switch>
  )
}