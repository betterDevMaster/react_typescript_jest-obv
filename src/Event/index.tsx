import {PlatformActions} from 'Event/ActionsProvider/platform-actions'
import {useAttendee} from 'Event/auth'
import Dashboard from 'Event/Dashboard'
import {useEvent} from 'Event/EventProvider'
import PagePoints, {DASHBOARD} from 'Event/PointsProvider/PagePoints'
import {eventRoutes} from 'Event/Routes'
import {Template} from 'Event/template'
import {PublicFile} from 'lib/http-client'
import React, {useCallback} from 'react'
import {Redirect} from 'react-router-dom'
import {Form} from 'organization/Event/FormsProvider'
import {Speaker} from './SpeakerPage'
import {
  Localization,
  useWithTranslations,
} from 'Event/LanguageProvider/translations'
import {useWithAttendeeData} from 'Event/auth/attendee-data'
import {pipe} from 'ramda'
import {Background} from 'organization/Event/Backgrounds/BackgroundsProvider'
import {useRemoveVariables} from 'lib/template'

// Can't use 'Event' because that's already a native DOM type
// for browser events and we'd lose TS safety/import assist.
export interface ObvioEvent {
  id: number
  name: string
  slug: string
  start: string
  end: string
  has_ended: boolean
  num_attendees: number
  template: Template | null
  waiver: WaiverConfig | null
  tech_check: TechCheckConfig | null
  logo: PublicFile | null
  header_background: PublicFile | null
  points_summary_logo: PublicFile | null
  platform_actions: PlatformActions
  login_background: PublicFile | null
  login_logo: PublicFile | null
  favicon: PublicFile | null
  forms: Form[]
  has_infusionsoft: boolean
  dashboard_background: PublicFile | null
  welcome_image: PublicFile | null
  sidebar_background: PublicFile | null
  footer_image: PublicFile | null
  sponsor_page_title: string
  sponsor_question_icon: PublicFile | null
  speakers: Speaker[]
  localization: Localization | null
  domains: Domain[]
  backgrounds: Background[]
  zoom_backgrounds_title: string | null
  zoom_backgrounds_description: string | null
}

export interface WaiverConfig {
  logo: null | string
  title: null | string
  body: string
  is_enabled: boolean
  form: Form | null
  agree_statement: string | null
}

export interface TechCheckConfig {
  body: string
  additional_content: string | null
  start: string
  is_enabled: boolean
  area_key: string | null
}

export interface Domain {
  id: number
  url: string
}

export default function Event() {
  const attendee = useAttendee()
  const {hasTechCheck, hasWaiver} = useEvent()

  if (!attendee.has_password) {
    return <Redirect to={eventRoutes.step1} />
  }

  const shouldGoToStep2 = hasWaiver && !attendee.waiver
  if (shouldGoToStep2) {
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
    <PagePoints page={DASHBOARD}>
      <Dashboard user={attendee} />
    </PagePoints>
  )
}

/**
 * Using variables will dynamically replace any Event text
 * with known {{ variables }}.
 */
export function useVariables() {
  const withTranslations = useWithTranslations()
  const withAttendeeData = useWithAttendeeData()
  const removeVariables = useRemoveVariables()

  return useCallback(
    (text: string) => {
      const process = pipe(withTranslations, withAttendeeData, removeVariables)
      return process(text)
    },
    [withAttendeeData, withTranslations, removeVariables],
  )
}
