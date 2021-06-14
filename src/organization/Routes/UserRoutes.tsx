import EventList from 'organization/EventList'
import CreateEventForm from 'organization/EventList/CreateEventForm'
import {RouteEventProvider} from 'Event/EventProvider'
import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {useOrganization} from 'organization/OrganizationProvider'
import EventRoutes from 'organization/Event/EventRoutes'
import Team from 'organization/Team'
import {CREATE_EVENTS, UPDATE_TEAM} from 'organization/PermissionsProvider'
import AuthorizedPage from 'organization/AuthorizedPage'
import FormsProvider from 'organization/Event/FormsProvider'
import {OrganizationLanguageProvider} from 'Event/LanguageProvider'
import {StaticPointsProvider} from 'Event/PointsProvider'
import AttendeeProfileProvider from 'Event/visibility-rules/AttendeeProfileProvider'
import {StaticSubmissionsProvider} from 'Event/SubmissionsProvider'
import EventLiveUpdates from 'organization/EventLiveUpdates'

export default function UserRoutes() {
  const {routes} = useOrganization()

  return (
    <Switch>
      {/*
          Handle login redirect. Placed first here, rather than on login success to
          avoid hitting the event catch-all below, and getting a React
          render error .
        */}
      <Redirect path={routes.login} to={routes.events.root} />

      <Route path={routes.events.create}>
        <AuthorizedPage permission={CREATE_EVENTS}>
          <CreateEventForm />
        </AuthorizedPage>
      </Route>
      <Route path={routes.events.root} exact>
        <EventList />
      </Route>
      <Route path={routes.team}>
        <AuthorizedPage permission={UPDATE_TEAM}>
          <Team />
        </AuthorizedPage>
      </Route>
      <Route path={routes.events[':event'].root}>
        <RouteEventProvider>
          <FormsProvider>
            <OrganizationLanguageProvider>
              <StaticPointsProvider>
                <StaticSubmissionsProvider>
                  <AttendeeProfileProvider groups={{}} tags={[]}>
                    <EventLiveUpdates>
                      <EventRoutes />
                    </EventLiveUpdates>
                  </AttendeeProfileProvider>
                </StaticSubmissionsProvider>
              </StaticPointsProvider>
            </OrganizationLanguageProvider>
          </FormsProvider>
        </RouteEventProvider>
      </Route>
      <Redirect to={routes.events.root} />
    </Switch>
  )
}
