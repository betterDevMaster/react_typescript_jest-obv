import {PlatformActions} from 'Event/ActionsProvider/platform-actions'
import {useAttendee} from 'Event/auth'
import Dashboard from 'Event/Dashboard'
import PagePoints, {DASHBOARD} from 'Event/PointsProvider/PagePoints'
import {Template} from 'Event/template'
import {FileLocation} from 'lib/http-client'
import React, {useCallback} from 'react'
import {Form} from 'organization/Event/FormsProvider'
import {
  Localization,
  useWithAttendeeTranslations,
  useWithGuestTranslations,
} from 'Event/LanguageProvider/translations'
import {useWithAttendeeData, useWithPoints} from 'Event/auth/attendee-data'
import {pipe} from 'ramda'
import {useRemoveVariables} from 'lib/template'
import {Speaker} from 'Event/SpeakerPage'
import {Background} from 'organization/Event/Backgrounds/BackgroundsProvider'
import {CustomTicketRibbon} from 'organization/Event/DashboardConfig/TicketRibbonUpload'

// Can't use 'Event' because that's already a native DOM type
// for browser events and we'd lose TS safety/import assist.
export interface ObvioEvent {
  updated_at: string
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
  logo: FileLocation | null
  mobile_logo: FileLocation | null
  header_background: FileLocation | null
  points_summary_logo: FileLocation | null
  platform_actions: PlatformActions
  login_background: FileLocation | null
  login_logo: FileLocation | null
  favicon: FileLocation | null
  forms: Form[]
  has_infusionsoft: boolean
  dashboard_background: FileLocation | null
  welcome_image: FileLocation | null
  sidebar_background: FileLocation | null
  footer_image: FileLocation | null
  sponsor_page_title: string
  sponsor_question_icon: FileLocation | null
  speakers: Speaker[]
  localization: Localization | null
  domains: Domain[]
  backgrounds: Background[]
  zoom_backgrounds_title: string | null
  zoom_backgrounds_description: string | null
  ticket_ribbons: CustomTicketRibbon[]
  is_online: boolean
  requires_attendee_password: boolean
}

export interface WaiverConfig {
  logo: null | string
  title: null | string
  body: string
  is_enabled: boolean
  form: Form | null
  agree_statement: string | null
  signature_prompt: string | null
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

  // We fetch the user, and split the user from the attendee profile to allow
  // stubbing out data for org users while configuring dashboard.
  return (
    <PagePoints page={DASHBOARD}>
      <Dashboard user={attendee} />
    </PagePoints>
  )
}

/**
 * Attendee variables will replace known {{ variables }} for
 * a given attendee.
 *
 * @returns
 */
export function useAttendeeVariables() {
  const withTranslations = useWithAttendeeTranslations()
  const withAttendeeData = useWithAttendeeData()
  const withPoints = useWithPoints()
  const removeVariables = useRemoveVariables()

  return useCallback(
    (text: string = '') => {
      const process = pipe(
        withTranslations,
        withAttendeeData,
        withPoints,
        removeVariables,
      )
      return process(text)
    },
    [withAttendeeData, withTranslations, withPoints, removeVariables],
  )
}

/**
 * Guest variables don't assume the user is logged in, and
 * will only replace what is available as a guest.
 *
 * @returns
 */
export function useGuestVariables() {
  const withTranslations = useWithGuestTranslations()
  const removeVariables = useRemoveVariables()

  return useCallback(
    (text: string = '') => {
      const process = pipe(withTranslations, removeVariables)
      return process(text)
    },
    [withTranslations, removeVariables],
  )
}
