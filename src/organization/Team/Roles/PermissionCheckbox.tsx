import Checkbox from '@material-ui/core/Checkbox'
import {ResponseError} from 'lib/ui/api-client'
import {onChangeCheckedHandler} from 'lib/dom'
import {
  Permission,
  UPDATE_TEAM,
  useCanUpdatePermission,
  usePermissions,
} from 'organization/PermissionsProvider'
import {
  Role,
  useAddPermission,
  useRoles,
  useRemovePermission,
} from 'organization/Team/Roles/RolesProvider'
import React from 'react'

export default function PermissionCheckbox(props: {
  role: Role
  permission: Permission
  processing: boolean
  setProcessing: (processing: boolean) => void
  onError: (error: ResponseError) => void
}) {
  const {updateRole} = useRoles()
  const hasPermission = props.role.permissions.includes(props.permission)

  const {can} = usePermissions()

  const add = useAddPermission()
  const remove = useRemovePermission()
  const canUpdatePermission = useCanUpdatePermission(props.permission)

  const updatePermission = (isAdd: boolean) => {
    if (props.processing || !can(UPDATE_TEAM)) {
      return
    }
    if (!canUpdatePermission) {
      return
    }
    const update = isAdd ? add : remove

    props.setProcessing(true)
    update(props.role, props.permission)
      .then(updateRole)
      .catch(props.onError)
      .finally(() => {
        props.setProcessing(false)
      })
  }

  return (
    <Checkbox
      disabled={!canUpdatePermission}
      checked={hasPermission}
      onChange={onChangeCheckedHandler(updatePermission)}
      color="primary"
      inputProps={{
        'aria-label': 'toggle permission',
      }}
      disableRipple
    />
  )
}
