import {User} from 'auth/user'

export type Groups = Record<string, any>
export type Tags = string[]

export type Attendee = User & {
  groups: Groups
  tags: Tags
  login_token: string
  waiver: string | null
}
