import {Plan} from 'obvio/Billing/plans'
import {Role} from 'organization/Team/Roles/RolesProvider'

export interface User {
  id: number
  first_name: string
  last_name: string
  email: string
}

export type TeamMember = User & {
  permissions: string[]
  role: Role | null
  has_active_subscription: boolean
  credits: number
  plan: Plan | null
  has_payment_method: boolean
  feature_flags: string[] | null
  has_unpaid_transactions: boolean
  is_founder: boolean
  is_subscribed: boolean
}

export function isTeamMember(user: User | null): user is TeamMember {
  if (!user) {
    return false
  }

  /**
   * We assume if the user has waiver they're an Attendee.
   */
  const hasWaiver = Object.prototype.hasOwnProperty.call(user, 'waiver')
  return !hasWaiver
}
