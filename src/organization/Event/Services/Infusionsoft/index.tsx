import {useQueryParams} from 'lib/url'
import AuthCallbackHandler from 'organization/Event/Services/Infusionsoft/AuthCallbackHandler'
import Config from 'organization/Event/Services/Infusionsoft/Config'
import LinkPage from 'organization/Event/Services/Infusionsoft/LinkPage'
import {
  BaseIntegration,
  INFUSIONSOFT,
  useServices,
} from 'organization/Event/Services/ServicesProvider'
import React from 'react'

export type InfusionsoftIntegration = BaseIntegration & {
  service: typeof INFUSIONSOFT
  has_completed_setup: boolean
}

export interface Tag {
  id: number
  infusionsoft_id: number | null
  name: string | null
  type: TagType
}

/**
 * Tag types as defined in API's InfusionsoftTagType class
 */

export const ADD_ATTENDEE = 'add_attendee'
export const UPDATE_ATTENDEE = 'update_attendee'
export const DELETE_ATTENDEE = 'delete_attendee'
export const ATTENDEE_ADDED = 'attendee_added'
export const ATTENDEE_SIGNED_WAIVER = 'attendee_signed_waiver'
export const ATTENDEE_CHECKED_IN = 'attendee_checked_in'

export type TagType =
  | typeof ADD_ATTENDEE
  | typeof UPDATE_ATTENDEE
  | typeof DELETE_ATTENDEE
  | typeof ATTENDEE_ADDED
  | typeof ATTENDEE_CHECKED_IN
  | typeof ATTENDEE_SIGNED_WAIVER

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
