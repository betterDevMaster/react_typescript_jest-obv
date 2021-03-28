import {Permission, usePermissions} from 'organization/PermissionsProvider'
import React from 'react'

export default function AuthorizedPage(props: {
  permission: Permission
  children: React.ReactElement
}) {
  const {can} = usePermissions()

  if (!can(props.permission)) {
    return <Forbidden />
  }

  return props.children
}

function Forbidden() {
  return <div>You do not have permission to view this page.</div>
}
