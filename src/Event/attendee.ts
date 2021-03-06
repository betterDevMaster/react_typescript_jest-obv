import {User} from 'auth/user'
import {isAttendee, useEventAuth} from 'Event/auth'
import {useEvent} from 'Event/EventProvider'
import {useToggle} from 'lib/toggle'
import {api} from 'lib/url'
import {useEffect} from 'react'

export type GroupKey = string
export type GroupValue = string | number
export type Groups = Record<GroupKey, GroupValue>

export type Tags = string[]

export type Attendee = User & {
  first_name?: string | null
  last_name?: string | null
  groups: Groups
  tags: Tags
  login_token: string
  waiver: string | null
  has_password: boolean
  tech_check_completed_at: string | null
  checked_in_at: string | null
  login_url: string
  is_active: boolean
  has_checked_in: boolean
  has_completed_tech_check: boolean
  has_mailchimp: boolean
}

/**
 * Mark a user a checked-in on the server. Checked-in is NOT the same
 * as completing tech-check. Checked-in meaning completing all
 * required steps to access dashboard.
 *
 * @param user
 */
export function useCheckIn(user: User) {
  const {client} = useEvent()
  const {setUser} = useEventAuth()
  const {flag: processing, toggle: toggleProcessing} = useToggle()

  useEffect(() => {
    /**
     * If Check-In is called with a different user type (ie. host editing dashboard), then
     * we don't have an attendee, so we'll just skip check-in.
     */
    if (!isAttendee(user) || user.has_checked_in) {
      return
    }

    /**
     * Prevent multiple requests...
     */
    if (processing) {
      return
    }

    toggleProcessing()

    const url = api('/check_in')
    client
      .put<Attendee>(url)
      .then((updated) => {
        // Instead of setting the entire updated user, we'll only replace
        // the relevant fields. This is to fix a bug where a user would
        // be re-directed back after landing on dashboard.
        const withCheckedIn: Attendee = {
          ...user,
          has_checked_in: updated.has_checked_in,
          checked_in_at: updated.checked_in_at,
        }

        setUser(withCheckedIn)
      })
      .finally(toggleProcessing)
  }, [user, client, setUser, toggleProcessing, processing])
}
