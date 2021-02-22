import {PlatformActions} from 'Event/ActionsProvider/platform-actions'
import {useAttendee} from 'Event/auth'
import Dashboard from 'Event/Dashboard'
import AttendeeProfileProvider from 'Event/Dashboard/component-rules/AttendeeProfileProvider'
import {useEvent} from 'Event/EventProvider'
import PagePoints, {DASHBOARD} from 'Event/PointsProvider/PagePoints'
import {eventRoutes} from 'Event/Routes'
import {Template} from 'Event/template'
import {PublicFile} from 'lib/http-client'
import {Area} from 'organization/Event/AreasProvider'
import React from 'react'
import {Redirect} from 'react-router-dom'

export interface WaiverConfig {
  logo: null | string
  title: null | string
  body: string
}

export interface TechCheckConfig {
  body: string
  is_enabled: boolean
  area: Area
}

export interface SpeakerPage {
  title: string
  speakers: Speaker[]
}

export interface Speaker {
  id: number
  image: PublicFile | null
  name: string
  text: string
}

// Can't use 'Event' because that's already a native DOM type
// for browser events and we'd lose TS safety/import assist.
export interface ObvioEvent {
  id: number
  name: string
  slug: string
  template: Template | null
  waiver: WaiverConfig | null
  speaker_page: SpeakerPage | null
  tech_check: TechCheckConfig | null
  logo: PublicFile | null
  header_background: PublicFile | null
  points_summary_logo: PublicFile | null
  platform_actions: PlatformActions
}

export default function Event() {
  const attendee = useAttendee()
  const {hasTechCheck} = useEvent()

  if (!attendee.has_password) {
    return <Redirect to={eventRoutes.step1} />
  }

  if (!attendee.waiver) {
    return <Redirect to={eventRoutes.step2} />
  }

  const shouldRedirectToStep3 =
    hasTechCheck && !attendee.tech_check_completed_at
  if (shouldRedirectToStep3) {
    return <Redirect to={eventRoutes.step3} />
  }

  // We fetch the user, and split the user from the attendee profile to allow
  // stubbing out data for org users while configuring dashboard.
  return (
    <AttendeeProfileProvider groups={attendee.groups} tags={attendee.tags}>
      <PagePoints page={DASHBOARD}>
        <Dashboard user={attendee} />
      </PagePoints>
    </AttendeeProfileProvider>
  )
}
