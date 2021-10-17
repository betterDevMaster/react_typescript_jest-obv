import {useQueryParams} from 'lib/url'
import React from 'react'
import {
  BaseIntegration,
  MAILCHIMP,
  useServices,
} from 'organization/Event/Services/ServicesProvider'
import LinkPage from 'organization/Event/Services/Apps/Mailchimp/LinkPage'
import Config from 'organization/Event/Services/Apps/Mailchimp/Config'
import AuthPage from 'organization/Event/Services/Apps/Mailchimp/AuthPage'

export type MailchimpIntegration = BaseIntegration & {
  service: typeof MAILCHIMP
  has_completed_setup: boolean
  auto_sync_tags_enabled: boolean
  audience_id: string | null
  login_url_field_id: string | null
  access_token_id: number | null
}

/**
 * Tag types as defined in API's MailchimpTagType class
 */

export const ATTENDEE_SIGNED_WAIVER = 'attendee_signed_waiver'
export const ATTENDEE_CHECKED_IN = 'attendee_checked_in'

export type TagType = typeof ATTENDEE_CHECKED_IN | typeof ATTENDEE_SIGNED_WAIVER

export interface Tag {
  id: number
  name: string | null
  type: TagType
}

export default function Mailchimp() {
  const mailchimp = useFindMailchimp()

  /**
   * Mailchimp redirects back with an auth code
   * in a URL param named 'code'
   */
  const {code} = useQueryParams()

  if (mailchimp?.has_completed_setup) {
    return <Config />
  }

  if (code) {
    return <AuthPage authCode={code} />
  }

  return <LinkPage />
}

export function useMailchimp() {
  const mailchimp = useFindMailchimp()
  if (!mailchimp) {
    throw new Error('Mailchimp integration has not been created')
  }

  return mailchimp
}

function useFindMailchimp() {
  const {integrations} = useServices()

  for (const integration of integrations) {
    if (integration.service === MAILCHIMP) {
      return integration
    }
  }

  return null
}
