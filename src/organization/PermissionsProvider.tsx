import {useAsync} from 'lib/async'
import FullPageLoader from 'lib/ui/layout/FullPageLoader'
import {api} from 'lib/url'
import {useArea} from 'organization/Event/Area/AreaProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import {useIsOwner} from 'organization/OwnerProvider'
import React, {useCallback} from 'react'

/**
 * Pre-defined system permissions. We expect the API to return one of these
 * permissions. If a permission has been added/updated in the API, we'll
 * need to update it here as well.
 */
export const CREATE_EVENTS = 'events.create'
export const CONFIGURE_EVENTS = 'events.configure'
export const UPDATE_TEAM = 'team.update'
export const START_ROOMS = 'rooms.start'
export const CHECK_IN_ATTENDEES = 'attendees.check_in'
export const UPDATE_ATTENDEES = 'attendees.update'
export const VIEW_RECORDINGS = 'recordings.view'
export const PURCHASE_CREDITS = 'purchase.credits'

export type Permission =
  | typeof CREATE_EVENTS
  | typeof CONFIGURE_EVENTS
  | typeof UPDATE_TEAM
  | typeof START_ROOMS
  | typeof CHECK_IN_ATTENDEES
  | typeof UPDATE_ATTENDEES
  | typeof VIEW_RECORDINGS
  | typeof PURCHASE_CREDITS

/**
 * Permissions that only an owner may update.
 */
export const OWNER_ONLY_PERMISSIONS = [PURCHASE_CREDITS]

interface PermissionsContextProps {
  user: Permission[]
  all: Permission[]
  can: (permission: Permission) => boolean
}

const PermissionsContext = React.createContext<
  PermissionsContextProps | undefined
>(undefined)

export default function PermissionsProvider(props: {
  children: React.ReactNode
}) {
  const fetchUserPermissions = useFetchUserPermissions()
  const {data: user, loading: loadingUser} = useAsync(fetchUserPermissions)

  const fetchAll = useFetchAllPermissions()
  const {data: all, loading: loadingAll} = useAsync(fetchAll)

  const loading = loadingUser || loadingAll

  if (loading || !user || !all) {
    return <FullPageLoader />
  }

  const can = (permission: Permission) => user.includes(permission)

  return (
    <PermissionsContext.Provider value={{user, all, can}}>
      {props.children}
    </PermissionsContext.Provider>
  )
}

function useFetchUserPermissions() {
  const {
    organization: {id},
    client,
  } = useOrganization()

  return useCallback(() => {
    const url = api(`/organizations/${id}/permissions`)
    return client.get<Permission[]>(url)
  }, [id, client])
}

function useFetchAllPermissions() {
  const {client} = useOrganization()

  return useCallback(() => {
    const url = api(`/permissions`)
    return client.get<Permission[]>(url)
  }, [client])
}

export function usePermissions() {
  const context = React.useContext(PermissionsContext)
  if (context === undefined) {
    throw new Error(`usePermissions must be used within a PermissionsProvider`)
  }

  return context
}

export function label(permission: Permission) {
  switch (permission) {
    case CREATE_EVENTS:
      return 'Create Events'
    case CONFIGURE_EVENTS:
      return 'Configure Events'
    case UPDATE_TEAM:
      return 'Update Team'
    case START_ROOMS:
      return 'Start Rooms'
    case CHECK_IN_ATTENDEES:
      return 'Check-In Attendees'
    case UPDATE_ATTENDEES:
      return 'Update Attendees'
    case VIEW_RECORDINGS:
      return 'View Recordings'
    case PURCHASE_CREDITS:
      return 'Purchase Credits'
    default:
      throw new Error(
        `Unhandled permission: ${permission}; was it added to the Permission type?`,
      )
  }
}

/**
 * Checks whether a user can start a room. This hook
 * takes into account the current area, and allows
 * tech check agents to start rooms.
 *
 * @returns
 */
export function useCanStartRooms() {
  const {can} = usePermissions()
  const {area} = useArea()

  if (can(START_ROOMS)) {
    return true
  }

  /**
   * If is tech check agent, lets allow them
   * to start tech-check rooms.
   */
  if (!can(CHECK_IN_ATTENDEES)) {
    return false
  }

  return area.is_tech_check
}

export function IfCanStartRooms(props: {
  children: JSX.Element | JSX.Element[]
}) {
  const canStartRooms = useCanStartRooms()
  if (!canStartRooms) {
    return null
  }

  return <>{props.children}</>
}

export function useCanUpdatePermission(permission: Permission) {
  const isOwner = useIsOwner()

  if (isOwner) {
    return true
  }

  return !OWNER_ONLY_PERMISSIONS.includes(permission)
}
