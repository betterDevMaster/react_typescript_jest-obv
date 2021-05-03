import {User} from 'auth/user'

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
  login_url: string
}
