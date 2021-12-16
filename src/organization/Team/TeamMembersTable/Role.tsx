import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import {onUnknownChangeHandler} from 'lib/dom'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import {UPDATE_TEAM, usePermissions} from 'organization/PermissionsProvider'
import {TeamMember} from 'auth/user'
import {useCanAssign, useRoles} from 'organization/Team/Roles/RolesProvider'
import {useTeam} from 'organization/Team/TeamProvider'
import React, {useState} from 'react'
import UnableAssignRoleDialog from './UnableAssignRoleDialog'

export default function Role(props: {teamMember: TeamMember}) {
  const {can} = usePermissions()
  if (!can(UPDATE_TEAM)) {
    return <>{props.teamMember.role?.name || ''}</>
  }

  return <RoleSelect teamMember={props.teamMember} />
}

function RoleSelect(props: {teamMember: TeamMember}) {
  const {teamMember} = props
  const {roles} = useRoles()

  const {
    assign,
    processing: processingAssign,
    assignError,
    dismissAssignError,
  } = useAssign(teamMember)
  const {unassign, processing: processingUnassign} = useUnassign(teamMember)

  const canAssign = useCanAssign()

  const isProcessing = processingAssign || processingUnassign

  const onPick = (id: number) => {
    if (id) {
      assign(id)
    } else {
      unassign()
    }
  }

  return (
    <>
      <UnableAssignRoleDialog
        message={assignError}
        onClose={dismissAssignError}
      />
      <Select
        disabled={isProcessing}
        value={teamMember.role?.id || 0}
        fullWidth
        onChange={onUnknownChangeHandler(onPick)}
        inputProps={{
          'aria-label': 'pick role',
        }}
        variant="outlined"
      >
        <MenuItem value={0} aria-label="remove role">
          None
        </MenuItem>
        {roles.map((role) => (
          <MenuItem
            key={role.id}
            value={role.id}
            aria-label={`pick ${role.name}`}
            disabled={!canAssign(role)}
          >
            {role.name}
          </MenuItem>
        ))}
      </Select>
    </>
  )
}

function useAssign(teamMember: TeamMember) {
  const {client, organization} = useOrganization()
  const team = useTeam()
  const [processing, setProcessing] = useState(false)
  const [assignError, setAssignError] = useState()

  const url = api(
    `/organizations/${organization.id}/team_members/${teamMember.id}/role`,
  )

  const assign = (id: number) => {
    if (processing) {
      return
    }

    setProcessing(true)

    client
      .put<TeamMember>(url, {
        role_id: id,
      })
      .then(team.update)
      .catch((err) => {
        setAssignError(err.message)
      })
      .finally(() => {
        setProcessing(false)
      })
  }

  const dismissAssignError = () => {
    setAssignError(undefined)
  }

  return {assign, processing, assignError, dismissAssignError}
}

function useUnassign(teamMember: TeamMember) {
  const {client, organization} = useOrganization()
  const team = useTeam()
  const [processing, setProcessing] = useState(false)

  const url = api(
    `/organizations/${organization.id}/team_members/${teamMember.id}/role`,
  )

  const unassign = () => {
    if (processing) {
      return
    }

    setProcessing(true)

    client
      .delete<TeamMember>(url)
      .then(team.update)
      .finally(() => {
        setProcessing(false)
      })
  }

  return {unassign, processing}
}
