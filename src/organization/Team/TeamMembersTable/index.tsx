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
import {
  TeamInvitation,
  useTeamInvitations,
} from 'organization/Team/TeamInvitationsProvider'
import ResendButton from 'organization/Team/TeamMembersTable/ResendButton'
import {api} from 'lib/url'
import {useToggle} from 'lib/toggle'
import {useOrganization} from 'organization/OrganizationProvider'
import {useState} from 'react'
import ErrorAlert from 'lib/ui/alerts/ErrorAlert'

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

  const {
    resend: resendInvitation,
    processing: processingResend,
    error: resendError,
    clearError: clearResendError,
  } = useResendInvitation()

  const processing =
    processingTeamMember || processingInvites || processingResend

  const hasTeamMembers = members.length > 0 || memberInvites.length > 0
  if (!hasTeamMembers) {
    return <EmptyPlaceholder>No team members have been added.</EmptyPlaceholder>
  }
  return (
    <>
      <ErrorAlert onClose={clearResendError}>{resendError}</ErrorAlert>
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
              <TableCell>{invite.email}</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>{invite.role?.name || '-'}</TableCell>
              <TableCell>
                <IconBox>
                  <DeleteIconButton
                    disabled={processing}
                    onClick={() => removeInvite(invite)}
                    aria-label="remove team invitation"
                  />
                  <StyledResendButton
                    disabled={processing}
                    aria-label="resend invitation"
                    onClick={() => resendInvitation(invite)}
                  />
                </IconBox>
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
    </>
  )
}

function useResendInvitation() {
  const {flag: processing, toggle: toggleProcessing} = useToggle()
  const {client} = useOrganization()

  const [error, setError] = useState<string | null>(null)
  const clearError = () => setError(null)

  const resend = (invitation: TeamInvitation) => {
    if (processing) {
      return
    }

    clearError()

    toggleProcessing()

    const url = api(`/team_invitations/${invitation.id}`)
    return client
      .post(url)
      .catch((error) => setError(error.message))
      .finally(toggleProcessing)
  }

  return {
    resend,
    processing,
    error,
    clearError,
  }
}

const EmptyPlaceholder = styled.p`
  text-align: center;
`

const IconBox = styled.div`
  display: flex;
  align-items: center;
`

const StyledResendButton = styled(ResendButton)`
  margin-left: ${(props) => props.theme.spacing[1]};
`
