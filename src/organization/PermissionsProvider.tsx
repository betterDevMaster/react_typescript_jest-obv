import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import React, {useCallback} from 'react'

/**
 * Pre-defined system permissions. We expect the API to return one of these
 * permissions. If a permission has been added/updated in the API, we'll
 * need to update it here as well.
 */
export const CREATE_EVENTS = 'events.create'
export const CONFIGURE_EVENTS = 'events.configure'
export const UPDATE_TEAM = 'team.update'

export type Permission =
  | typeof CREATE_EVENTS
  | typeof CONFIGURE_EVENTS
  | typeof UPDATE_TEAM

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
    return <div>loading...</div>
  }

  const can = (permission: Permission) => user.includes(permission)

  return (
    <PermissionsContext.Provider value={{user, all, can}}>
      {props.children}
    </PermissionsContext.Provider>
  )
}

function useFetchUserPermissions() {
  const {organization, client} = useOrganization()

  return useCallback(() => {
    const url = api(`/organizations/${organization.slug}/permissions`)
    return client.get<Permission[]>(url)
  }, [organization, client])
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
    default:
      throw new Error(
        `Unhandled permission: ${permission}; was it added to the Permission type?`,
      )
  }
}
