import {Permission, usePermissions} from 'organization/PermissionsProvider'
import React from 'react'

export default function HasPermission(props: {
  permission: Permission
  children: React.ReactElement
}) {
  const {can} = usePermissions()

  if (!can(props.permission)) {
    return null
  }

  return props.children
}
