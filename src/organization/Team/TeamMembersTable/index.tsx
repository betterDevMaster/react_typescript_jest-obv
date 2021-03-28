import styled from 'styled-components'
import {TeamMember} from 'organization/Team'
import React from 'react'
import DeleteIconButton from 'lib/ui/IconButton/DeleteIconButton'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import {useTeam} from 'organization/Team/TeamProvider'
import {UPDATE_TEAM} from 'organization/PermissionsProvider'
import HasPermission from 'organization/HasPermission'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'
import Role from 'organization/Team/TeamMembersTable/Role'

export default function TeamMemberList() {
  const {members, remove: removeFromList} = useTeam()
  const removeOnServer = useRemove()
  const handleRemove = (target: TeamMember) => {
    removeOnServer(target).then(removeFromList)
  }

  const hasTeamMembers = members.length > 0
  if (!hasTeamMembers) {
    return <EmptyPlaceholder>No team members have been added.</EmptyPlaceholder>
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Email</TableCell>
          <TableCell>Last Name</TableCell>
          <TableCell>First Name</TableCell>
          <TableCell>Role</TableCell>
          <HasPermission permission={UPDATE_TEAM}>
            <TableCell>{/* Delete member cell */}</TableCell>
          </HasPermission>
        </TableRow>
      </TableHead>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.id} aria-label="team member">
            <TableCell>{member.email}</TableCell>
            <TableCell>{member.last_name}</TableCell>
            <TableCell>{member.first_name}</TableCell>
            <TableCell>
              <Role teamMember={member} />
            </TableCell>
            <HasPermission permission={UPDATE_TEAM}>
              <TableCell>
                <DeleteIconButton
                  onClick={() => handleRemove(member)}
                  aria-label="remove team member"
                />
              </TableCell>
            </HasPermission>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function useRemove() {
  const {organization, client} = useOrganization()

  return (target: TeamMember) => {
    const url = api(
      `/organizations/${organization.slug}/team_members/${target.id}`,
    )

    return client.delete<TeamMember>(url)
  }
}

const EmptyPlaceholder = styled.p`
  text-align: center;
`
