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
  has_paid: boolean
  feature_flags: string[] | null
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
