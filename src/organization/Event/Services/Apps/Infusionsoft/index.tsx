import {useQueryParams} from 'lib/url'
import AuthCallbackHandler from 'organization/Event/Services/Apps/Infusionsoft/AuthCallbackHandler'
import Config from 'organization/Event/Services/Apps/Infusionsoft/Config'
import LinkPage from 'organization/Event/Services/Apps/Infusionsoft/LinkPage'
import {
  BaseIntegration,
  INFUSIONSOFT,
  useServices,
} from 'organization/Event/Services/ServicesProvider'
import React from 'react'

export type InfusionsoftIntegration = BaseIntegration & {
  service: typeof INFUSIONSOFT
  has_completed_setup: boolean
  can_import_attendees: boolean
  login_field_name: string | null
  login_field_label: string | null
  has_set_import_tag: boolean
  tags: Tag[]
  groups: InfusionsoftGroup[]
}

export interface Tag {
  id: number
  infusionsoft_id: number | null
  name: string | null
  type: TagType
}

export interface InfusionsoftGroup {
  infusionsoft_field_name: string | null
  infusionsoft_field_label: string | null
  key: string | null
}

/**
 * Tag types as defined in API's InfusionsoftTagType class
 */

export const ATTENDEE_CREATED = 'attendee_created'
export const ATTENDEE_SIGNED_WAIVER = 'attendee_signed_waiver'
export const ATTENDEE_CHECKED_IN = 'attendee_checked_in'
export const IMPORT_TAG = 'import_tag'

export type TagType =
  | typeof ATTENDEE_CREATED
  | typeof ATTENDEE_CHECKED_IN
  | typeof ATTENDEE_SIGNED_WAIVER
  | typeof IMPORT_TAG

export default function Infusionsoft() {
  const {isLinked} = useServices()
  const showConfig = isLinked(INFUSIONSOFT)

  /**
   * Infusionsoft redirects back with an auth code
   * in a URL param named 'code'
   */
  const {code} = useQueryParams()

  if (showConfig) {
    return <Config />
  }

  if (code) {
    return <AuthCallbackHandler authCode={code} />
  }

  return <LinkPage />
}
