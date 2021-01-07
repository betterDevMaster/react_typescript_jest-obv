import DashboardConfig from 'organization/Event/DashboardConfig'
import EventConfig from 'organization/Event'
import WaiverConfig from 'organization/Event/WaiverConfig'
import TechCheckConfig from 'organization/Event/TechCheckConfig'
import AttendeeList from 'organization/Event/AttendeeList'
import Emoji from 'organization/Event/EmojiPage'
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
      <Route path={routes.events[':event'].tech_check}>
        <TechCheckConfig />
      </Route>
      <Route path={routes.events[':event'].attendees}>
        <AttendeeList />
      </Route>
      <Route path={routes.events[':event'].emoji}>
        <Emoji />
      </Route>
      <Redirect to={routes.events[':event'].root} />
    </Switch>
  )
}
