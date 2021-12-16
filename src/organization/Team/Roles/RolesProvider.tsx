import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import {useIsOwner} from 'organization/OwnerProvider'
import {
  OWNER_ONLY_PERMISSIONS,
  Permission,
} from 'organization/PermissionsProvider'
import React, {useCallback, useEffect, useState} from 'react'

export interface Role {
  id: number
  name: string
  permissions: Permission[]
}

interface RolesContextProps {
  roles: Role[]
  addRole: (role: Role) => void
  removeRole: (role: Role) => void
  updateRole: (role: Role) => void
}

const RolesContext = React.createContext<RolesContextProps | undefined>(
  undefined,
)

export default function RolesProvider(props: {children: React.ReactNode}) {
  const [roles, setRoles] = useState<Role[]>([])
  const fetchRoles = useFetchRoles()
  const {data: fetchedRoles, loading} = useAsync(fetchRoles)

  useEffect(() => {
    if (!fetchedRoles) {
      return
    }

    setRoles(fetchedRoles)
  }, [fetchedRoles])

  const add = (role: Role) => {
    setRoles([...roles, role])
  }

  const remove = (target: Role) => {
    const updated = roles.filter((r) => r.id !== target.id)
    setRoles(updated)
  }

  const update = (target: Role) => {
    const updated = roles.map((r) => {
      const isTarget = r.id === target.id
      if (!isTarget) {
        return r
      }

      return target
    })
    setRoles(updated)
  }

  if (loading) {
    return null
  }

  return (
    <RolesContext.Provider
      value={{
        roles,
        addRole: add,
        removeRole: remove,
        updateRole: update,
      }}
    >
      {props.children}
    </RolesContext.Provider>
  )
}

export function useRoles() {
  const context = React.useContext(RolesContext)
  if (context === undefined) {
    throw new Error(`useRoles must be used within a RolesProvider`)
  }

  return context
}

function useFetchRoles() {
  const {client, organization} = useOrganization()

  return useCallback(() => {
    const url = api(`/organizations/${organization.id}/roles`)
    return client.get<Role[]>(url)
  }, [organization, client])
}

export function useAddPermission() {
  const {client, organization} = useOrganization()

  return (role: Role, permission: Permission) => {
    const url = api(
      `/organizations/${organization.id}/roles/${role.id}/permissions`,
    )

    return client.put<Role>(url, {permission})
  }
}

export function useRemovePermission() {
  const {client, organization} = useOrganization()

  return (role: Role, permission: Permission) => {
    const url = api(
      `/organizations/${organization.id}/roles/${role.id}/permissions/${permission}`,
    )

    return client.delete<Role>(url)
  }
}

export function useCanAssign() {
  const isOwner = useIsOwner()

  return (role: Role) => {
    if (isOwner) {
      return true
    }

    // Can only select a role if it does NOT conain any protected permissions
    return (
      role.permissions.filter((p) => OWNER_ONLY_PERMISSIONS.includes(p))
        .length === 0
    )
  }
}
