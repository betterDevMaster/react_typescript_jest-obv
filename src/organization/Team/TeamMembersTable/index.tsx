import styled from 'styled-components'
import React from 'react'
import DeleteIconButton from 'lib/ui/IconButton/DeleteIconButton'
import {useTeam} from 'organization/Team/TeamProvider'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'
import Role from 'organization/Team/TeamMembersTable/Role'
import {useTeamInvitations} from 'organization/Team/TeamInvitationsProvider'

export default function TeamMemberList() {
  const {
    members,
    remove: removeTeamMember,
    processing: processingTeamMember,
  } = useTeam()
  const {
    invitations: memberInvites,
    remove: removeInvite,
    processing: processingInvites,
  } = useTeamInvitations()

  const processing = processingTeamMember || processingInvites

  const hasTeamMembers = members.length > 0 || memberInvites.length > 0
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
          <TableCell>{/* Delete member cell */}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {memberInvites.map((invite) => (
          <TableRow key={invite.id} aria-label="team invitation">
            <TableCell>
              {invite.email} <em>(Invitation Sent)</em>
            </TableCell>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
            <TableCell></TableCell>
            <TableCell>
              <DeleteIconButton
                disabled={processing}
                onClick={() => removeInvite(invite)}
                aria-label="remove team invitation"
              />
            </TableCell>
          </TableRow>
        ))}

        {members.map((member) => (
          <TableRow key={member.id} aria-label="team member">
            <TableCell>{member.email}</TableCell>
            <TableCell>{member.last_name}</TableCell>
            <TableCell>{member.first_name}</TableCell>
            <TableCell>
              <Role teamMember={member} />
            </TableCell>
            <TableCell>
              <DeleteIconButton
                disabled={processing}
                onClick={() => removeTeamMember(member)}
                aria-label="remove team member"
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

const EmptyPlaceholder = styled.p`
  text-align: center;
`
