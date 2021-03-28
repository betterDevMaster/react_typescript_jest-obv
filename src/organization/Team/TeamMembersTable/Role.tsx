import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import {onUnknownChangeHandler} from 'lib/dom'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import {UPDATE_TEAM, usePermissions} from 'organization/PermissionsProvider'
import {TeamMember} from 'auth/user'
import {useRoles} from 'organization/Team/Roles/RolesProvider'
import {useTeam} from 'organization/Team/TeamProvider'
import React, {useState} from 'react'

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

  const {assign, processing: processingAssign} = useAssign(teamMember)
  const {unassign, processing: processingUnassign} = useUnassign(teamMember)

  const isProcessing = processingAssign || processingUnassign

  const onPick = (id: number) => {
    if (id) {
      assign(id)
    } else {
      unassign()
    }
  }

  return (
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
        >
          {role.name}
        </MenuItem>
      ))}
    </Select>
  )
}

function useAssign(teamMember: TeamMember) {
  const {client, organization} = useOrganization()
  const team = useTeam()
  const [processing, setProcessing] = useState(false)

  const url = api(
    `/organizations/${organization.slug}/team_members/${teamMember.id}/role`,
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
      .finally(() => {
        setProcessing(false)
      })
  }

  return {assign, processing}
}

function useUnassign(teamMember: TeamMember) {
  const {client, organization} = useOrganization()
  const team = useTeam()
  const [processing, setProcessing] = useState(false)

  const url = api(
    `/organizations/${organization.slug}/team_members/${teamMember.id}/role`,
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
