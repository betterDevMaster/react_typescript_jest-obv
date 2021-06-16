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
import CustomScripts from 'organization/Event/CustomScripts'
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
import AttendeeProfileProvider from 'Event/visibility-rules/AttendeeProfileProvider'
import {useTrackEventPage, useTrackOnLoad} from 'analytics'
import DownloadA360iReport from 'Event/DownloadA360iReport'

export const eventRoutes = createRoutes({
  login: '/login',
  forgot_password: '/forgot_password',
  reset_password: '/reset_password',
  step1: '/step_1',
  step2: '/step_2',
  step3: '/step_3',
  speakers: '/speakers',
  sponsors: '/sponsors',
  resources: '/resources',
  faq: '/faq',
  leaderboard: '/leaderboard',
  checkIn: '/check_in',
  area: {
    ':area': {},
  },
  report: '/report',
  backgrounds: '/backgrounds',
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
      <CustomScripts>
        <HTMLHead>
          <GuestRoutes />
        </HTMLHead>
      </CustomScripts>
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
          <CustomScripts>
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
          </CustomScripts>
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
        <Step2 />
      </Route>
      <Route path={eventRoutes.step3}>
        <Step3 />
      </Route>
      <Route path={eventRoutes.root} exact>
        <Event />
      </Route>
      <Route path={eventRoutes.speakers} exact>
        <Speakers />
      </Route>
      <Route path={eventRoutes.sponsors} exact>
        <SponsorPage />
      </Route>
      <Route path={eventRoutes.faq} exact>
        <FaqPage />
      </Route>
      <Route path={eventRoutes.leaderboard}>
        <Leaderboard />
      </Route>
      <Route path={eventRoutes.area[':area'].root}>
        <JoinArea />
      </Route>
      <Route path={eventRoutes.report}>
        <DownloadReport />
      </Route>
      <Route path="/a360i/reports/:index">
        <DownloadA360iReport />
      </Route>
      <Route path={eventRoutes.backgrounds}>
        <CompletedOnboarding>
          <Backgrounds />
        </CompletedOnboarding>
      </Route>
      <Route path={eventRoutes.checkIn}>
        <CompletedOnboarding step={2}>
          <SelfCheckIn />
        </CompletedOnboarding>
      </Route>
      <Redirect to={eventRoutes.root} />
    </Switch>
  )
}

function CompletedOnboarding(props: {
  children: React.ReactElement
  step?: 1 | 2
}) {
  const {step} = props
  const attendee = useAttendee()
  const {hasTechCheck, hasWaiver} = useEvent()

  if (!attendee.has_password) {
    return <Redirect to={eventRoutes.step1} />
  }

  if (step === 1) {
    return props.children
  }

  const shouldGoToStep2 = hasWaiver && !attendee.waiver
  if (shouldGoToStep2) {
    return <Redirect to={eventRoutes.step2} />
  }

  if (step === 2) {
    return props.children
  }

  const shouldRedirectToStep3 =
    hasTechCheck && !attendee.tech_check_completed_at
  if (shouldRedirectToStep3) {
    return <Redirect to={eventRoutes.step3} />
  }

  return props.children
}

function GuestRoutes() {
  return (
    <Switch>
      <Route path={eventRoutes.login}>
        <Login />
      </Route>
      <Route path={eventRoutes.forgot_password}>
        <ForgotPassword />
      </Route>
      <Route path={eventRoutes.reset_password}>
        <ResetPassword />
      </Route>
      <Redirect to={eventRoutes.login} />
    </Switch>
  )
}
