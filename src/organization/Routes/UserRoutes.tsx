import EventList from 'organization/EventList'
import CreateEventForm from 'organization/EventList/CreateEventForm'
import {RouteEventProvider} from 'Event/EventProvider'
import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {useOrganization} from 'organization/OrganizationProvider'
import EventRoutes from 'organization/Event/EventRoutes'
import Team from 'organization/Team'
import {
  CREATE_EVENTS,
  PURCHASE_CREDITS,
  UPDATE_TEAM,
} from 'organization/PermissionsProvider'
import AuthorizedPage from 'organization/AuthorizedPage'
import FormsProvider from 'organization/Event/FormsProvider'
import OrganizationSetting from 'organization/Settings'
import {OrganizationLanguageProvider} from 'Event/LanguageProvider'
import AttendeeProfileProvider from 'Event/attendee-rules/AttendeeProfileProvider'
import {StaticSubmissionsProvider} from 'Event/SubmissionsProvider'
import EventSocketProvider from 'organization/Event/EventSocketProvider'
import DownloadAreaAttendees from 'organization/Event/Area/DownloadAreaAttendees'
import DownloadFormSubmissions from 'organization/Event/Form/DownloadFormSubmissions'
import DownloadQuestionSubmissions from 'organization/Event/Form/DownloadQuestionSubmissions'
import DownloadRoomAttendees from 'organization/Event/Room/DownloadRoomAttendees'
import DownloadAttendees from 'Event/DownloadAttendees'
import DownloadWaivers from 'Event/DownloadWaivers'
import BuyCreditsPage from 'organization/BuyCreditsPage'

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
      <Route path={routes.settings}>
        <OrganizationSetting />
      </Route>

      <Route path={routes.buy_credits}>
        <AuthorizedPage permission={PURCHASE_CREDITS}>
          <BuyCreditsPage />
        </AuthorizedPage>
      </Route>
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
      <Route path={routes.area_attendees_export[':file'].root}>
        <DownloadAreaAttendees />
      </Route>
      <Route path={routes.form_submissions[':file'].root}>
        <DownloadFormSubmissions />
      </Route>
      <Route path={routes.question_submissions[':file'].root}>
        <DownloadQuestionSubmissions />
      </Route>
      <Route path={routes.room_attendees_export[':file'].root}>
        <DownloadRoomAttendees />
      </Route>
      <Route path={routes.attendees_export[':file'].root}>
        <DownloadAttendees />
      </Route>
      <Route path={routes.waivers[':file'].root}>
        <DownloadWaivers />
      </Route>
      <Route path={routes.events[':event'].root}>
        <RouteEventProvider>
          <FormsProvider>
            <OrganizationLanguageProvider>
              <StaticSubmissionsProvider>
                <AttendeeProfileProvider groups={{}} tags={[]}>
                  <EventSocketProvider>
                    <EventRoutes />
                  </EventSocketProvider>
                </AttendeeProfileProvider>
              </StaticSubmissionsProvider>
            </OrganizationLanguageProvider>
          </FormsProvider>
        </RouteEventProvider>
      </Route>
      <Redirect to={routes.events.root} />
    </Switch>
  )
}
