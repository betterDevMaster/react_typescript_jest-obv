import Event from 'Event'
import {useAttendee, useEventAuth} from 'Event/auth'
import Login from 'Event/auth/Login'
import {useEvent} from 'Event/EventProvider'
import Step1 from 'Event/Step1'
import Step2 from 'Event/Step2'
import Step3 from 'Event/Step3'
import {createRoutes, routesWithValue} from 'lib/url'
import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import Speakers from 'Event/SpeakerPage'
import {AutoRefreshActions, EventActionsProvider} from 'Event/ActionsProvider'
import PointsProvider from 'Event/PointsProvider'
import Leaderboard from 'Event/Leaderboard'
import Backgrounds from 'Event/Backgrounds'
import UnderConstruction from 'Event/UnderConstruction'
import TemplateProvider from 'Event/TemplateProvider'
import HTMLHead from 'Event/HTMLHead'
import ForgotPassword from 'Event/auth/ForgotPassword'
import ResetPassword from 'Event/auth/ResetPassword'
import SponsorPage from 'Event/SponsorPage'
import FaqPage from 'Event/FaqPage'
import SubmissionsProvider from 'Event/SubmissionsProvider'
import EventLanguageProvider from 'Event/LanguageProvider'
import JoinArea from 'Event/JoinArea/JoinArea'
import FullPageLoader from 'lib/ui/layout/FullPageLoader'
import DownloadReport from 'Event/DownloadReport'
import SelfCheckIn from 'Event/SelfCheckIn'
import AttendeeProfileProvider from 'Event/attendee-rules/AttendeeProfileProvider'
import {useTrackEventPage, useTrackOnLoad} from 'analytics'
import ChangePassword from 'Event/auth/ChangePassword'
import RoomRegistration from 'Event/RoomRegistration'
import DownloadA360iReport from 'Event/DownloadA360iReport'
import EventOfflinePage from 'Event/EventOfflinePage'
import PagePoints, {LEADERBOARD} from 'Event/PointsProvider/PagePoints'
import CompletedOnboarding from 'Event/CompletedOnboarding'
import ImageWaterfall from 'Event/ImageWaterfall'

export const eventRoutes = createRoutes({
  login: '/login',
  room: '/room',
  forgotPassword: '/forgot_password',
  resetPassword: '/reset_password',
  changePassword: '/change_password',
  step1: '/step_1',
  step2: '/step_2',
  step3: '/step_3',
  speakers: '/speakers',
  sponsors: '/sponsors',
  resources: '/resources',
  faq: '/faq',
  leaderboard: '/leaderboard',
  techCheck: '/tech_check',
  area: {
    ':area': {},
  },
  report: '/report',
  backgrounds: '/backgrounds',
  image_waterfall: '/image_waterfall',
})

/**
 * Event pages that a button/link may navigate to as a
 * relative link.
 */

export const EVENT_PAGES = {
  [eventRoutes.speakers]: 'Speakers',
  [eventRoutes.sponsors]: 'Sponsors',
  [eventRoutes.faq]: 'FAQ',
  [eventRoutes.leaderboard]: 'Leaderboard',
  [eventRoutes.backgrounds]: 'Backgrounds',
  [eventRoutes.report]: 'Download Report',
  [eventRoutes.image_waterfall]: 'Image Waterfall',
}

export type EventPages = typeof EVENT_PAGES

export const areaRoutes = (key: string) =>
  routesWithValue(':area', key, eventRoutes.area[':area'])

export default function Routes() {
  const {user, loading} = useEventAuth()
  const {event} = useEvent()

  useTrackEventPage({
    page: 'Accessed Site',
  })

  if (!event.template) {
    return <UnderConstruction />
  }

  if (!event.is_online) {
    return (
      <TemplateProvider template={event.template}>
        <EventOfflinePage />
      </TemplateProvider>
    )
  }

  if (loading) {
    return <FullPageLoader />
  }

  if (user) {
    return (
      <TemplateProvider template={event.template}>
        <Authenticated />
      </TemplateProvider>
    )
  }

  return (
    <TemplateProvider template={event.template}>
      <HTMLHead>
        <GuestRoutes />
      </HTMLHead>
    </TemplateProvider>
  )
}

function Authenticated() {
  const attendee = useAttendee()

  useTrackOnLoad({
    category: 'Attendee',
    action: 'Logged In',
  })

  return (
    <EventActionsProvider>
      <AutoRefreshActions>
        <PointsProvider>
          <SubmissionsProvider>
            <AttendeeProfileProvider
              groups={attendee.groups}
              tags={attendee.tags}
            >
              <EventLanguageProvider>
                <HTMLHead>
                  <UserRoutes />
                </HTMLHead>
              </EventLanguageProvider>
            </AttendeeProfileProvider>
          </SubmissionsProvider>
        </PointsProvider>
      </AutoRefreshActions>
    </EventActionsProvider>
  )
}

function UserRoutes() {
  return (
    <Switch>
      <Route path={eventRoutes.step1}>
        <Step1 />
      </Route>
      <Route path={eventRoutes.step2}>
        <CompletedOnboarding step={1}>
          <Step2 />
        </CompletedOnboarding>
      </Route>
      <Route path={eventRoutes.step3}>
        <CompletedOnboarding step={2}>
          <Step3 />
        </CompletedOnboarding>
      </Route>
      <Route path={eventRoutes.root} exact>
        <CompletedOnboarding>
          <Event />
        </CompletedOnboarding>
      </Route>
      <Route path={eventRoutes.speakers} exact>
        <CompletedOnboarding>
          <Speakers />
        </CompletedOnboarding>
      </Route>
      <Route path={eventRoutes.sponsors} exact>
        <CompletedOnboarding>
          <SponsorPage />
        </CompletedOnboarding>
      </Route>
      <Route path={eventRoutes.faq} exact>
        <CompletedOnboarding>
          <FaqPage />
        </CompletedOnboarding>
      </Route>
      <Route path={eventRoutes.leaderboard}>
        <CompletedOnboarding>
          <PagePoints page={LEADERBOARD}>
            <Leaderboard />
          </PagePoints>
        </CompletedOnboarding>
      </Route>
      <Route path={eventRoutes.area[':area'].root}>
        <JoinArea />
      </Route>
      <Route path={eventRoutes.report}>
        <CompletedOnboarding>
          <DownloadReport />
        </CompletedOnboarding>
      </Route>
      <Route path="/a360i/reports/:index">
        <DownloadA360iReport />
      </Route>
      <Route path={eventRoutes.backgrounds}>
        <CompletedOnboarding>
          <Backgrounds />
        </CompletedOnboarding>
      </Route>
      <Route path={eventRoutes.techCheck}>
        <CompletedOnboarding step={2}>
          <SelfCheckIn />
        </CompletedOnboarding>
      </Route>
      <Route path={eventRoutes.changePassword}>
        <ChangePassword />
      </Route>
      <Route path={eventRoutes.image_waterfall}>
        <ImageWaterfall />
      </Route>

      <Redirect to={eventRoutes.root} />
    </Switch>
  )
}

function GuestRoutes() {
  return (
    <Switch>
      <Route path={eventRoutes.login}>
        <Login />
      </Route>
      <Route path={eventRoutes.forgotPassword}>
        <ForgotPassword />
      </Route>
      <Route path={eventRoutes.resetPassword}>
        <ResetPassword />
      </Route>
      <Route path={eventRoutes.room}>
        <RoomRegistration />
      </Route>
      <Redirect to={eventRoutes.login} />
    </Switch>
  )
}
