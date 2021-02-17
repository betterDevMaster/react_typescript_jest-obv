import DashboardConfig from 'organization/Event/DashboardConfig'
import Event from 'organization/Event'
import WaiverConfig from 'organization/Event/WaiverConfig'
import TechCheckConfig from 'organization/Event/TechCheckConfig'
import AttendeeManagement from 'organization/Event/AttendeeManagement'
import Emoji from 'organization/Event/EmojiPage'
import SpeakerConfig from 'organization/Event/SpeakersConfig'
import {useOrganization} from 'organization/OrganizationProvider'
import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import CreateAreaForm from 'organization/Event/AreaList/CreateAreaForm'
import {ObvioEvent} from 'Event'
import {useParamEventSlug} from 'Event/url'
import {routesWithValue} from 'lib/url'
import {AreaProvider} from 'organization/Event/Area/AreaProvider'
import AreaRoutes from 'organization/Event/Area/AreaRoutes'
import PointsConfig from 'organization/Event/PointsConfig'
import AttendeesProvider from 'organization/Event/AttendeesProvider'

export function useEventRoutes(event?: ObvioEvent) {
  const {routes: organizationRoutes} = useOrganization()
  const slug = useParamEventSlug()
  const value = event ? event.slug : slug

  return routesWithValue(':event', value, organizationRoutes.events[':event'])
}

export default function EventRoutes() {
  const {routes} = useOrganization()

  return (
    <Switch>
      <Route path={routes.events[':event'].root} exact>
        <Event />
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
        <AttendeesProvider>
          <AttendeeManagement />
        </AttendeesProvider>
      </Route>
      <Route path={routes.events[':event'].emoji}>
        <Emoji />
      </Route>
      <Route path={routes.events[':event'].speakers}>
        <SpeakerConfig />
      </Route>
      <Route path={routes.events[':event'].points}>
        <PointsConfig />
      </Route>
      <Route path={routes.events[':event'].areas.create}>
        <CreateAreaForm />
      </Route>
      <Route path={routes.events[':event'].areas[':area'].root}>
        <AreaProvider>
          <AreaRoutes />
        </AreaProvider>
      </Route>
      <Redirect to={routes.events[':event'].root} />
    </Switch>
  )
}
