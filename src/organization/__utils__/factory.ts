import {
  CONFIGURE_EVENTS,
  CREATE_EVENTS,
  Permission,
  UPDATE_TEAM,
} from 'organization/PermissionsProvider'
import faker from 'faker'

export const ALL_PERMISSIONS: Permission[] = [
  CREATE_EVENTS,
  CONFIGURE_EVENTS,
  UPDATE_TEAM,
]

export const randomPermission = (): Permission =>
  faker.random.arrayElement(ALL_PERMISSIONS)
