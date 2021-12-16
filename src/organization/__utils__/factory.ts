import {
  CHECK_IN_ATTENDEES,
  CONFIGURE_EVENTS,
  CREATE_EVENTS,
  Permission,
  PURCHASE_CREDITS,
  START_ROOMS,
  UPDATE_ATTENDEES,
  UPDATE_TEAM,
  VIEW_RECORDINGS,
} from 'organization/PermissionsProvider'
import faker from 'faker'

export const ALL_PERMISSIONS: Permission[] = [
  CREATE_EVENTS,
  CONFIGURE_EVENTS,
  UPDATE_TEAM,
  START_ROOMS,
  CHECK_IN_ATTENDEES,
  UPDATE_ATTENDEES,
  VIEW_RECORDINGS,
  PURCHASE_CREDITS,
]

export const randomPermission = (): Permission =>
  faker.random.arrayElement(ALL_PERMISSIONS)
