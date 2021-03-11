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
import GeneralConfig from 'organization/Event/GeneralConfig'
import AttendeesProvider from 'organization/Event/AttendeesProvider'
import Services from 'organization/Event/Services'
import Zapier from 'organization/Event/Services/Zapier'
import ServicesProvider from 'organization/Event/Services/ServicesProvider'
import RoomAssignmentsProvider from 'organization/Event/RoomAssignmentsProvider'
import AreasProvider from 'organization/Event/AreasProvider'
import QuestionsConfig from 'organization/Event/QuestionsConfig'
import Infusionsoft from 'organization/Event/Services/Infusionsoft'

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
        <AreasProvider>
          <Event />
        </AreasProvider>
      </Route>
      <Route path={routes.events[':event'].dashboard}>
        <AreasProvider>
          <DashboardConfig />
        </AreasProvider>
      </Route>
      <Route path={routes.events[':event'].waiver}>
        <WaiverConfig />
      </Route>
      <Route path={routes.events[':event'].questions}>
        <QuestionsConfig />
      </Route>
      <Route path={routes.events[':event'].tech_check}>
        <AreasProvider>
          <TechCheckConfig />
        </AreasProvider>
      </Route>
      <Route path={routes.events[':event'].attendees}>
        <AttendeesProvider>
          <AreasProvider>
            <RoomAssignmentsProvider>
              <AttendeeManagement />
            </RoomAssignmentsProvider>
          </AreasProvider>
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
      <Route path={routes.events[':event'].general}>
        <GeneralConfig />
      </Route>
      <Route path={routes.events[':event'].services.root}>
        <ServicesProvider>
          <ServiceRoutes />
        </ServicesProvider>
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

function ServiceRoutes() {
  const {routes} = useOrganization()

  return (
    <Switch>
      <Route path={routes.events[':event'].services.zapier}>
        <Zapier />
      </Route>
      <Route path={routes.events[':event'].services.infusionsoft}>
        <Infusionsoft />
      </Route>
      <Route path={routes.events[':event'].services.root}>
        <Services />
      </Route>
    </Switch>
  )
}
