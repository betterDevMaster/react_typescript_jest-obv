import HasPermission from 'organization/HasPermission'
import {UPDATE_TEAM} from 'organization/PermissionsProvider'
import AddRoleForm from 'organization/Team/Roles/AddRoleForm'
import RolesTable from 'organization/Team/Roles/RolesTable'
import React from 'react'

export default function Roles() {
  return (
    <>
      <HasPermission permission={UPDATE_TEAM}>
        <AddRoleForm />
      </HasPermission>
      <RolesTable />
    </>
  )
}
