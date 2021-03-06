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
import {useOwner} from 'organization/OwnerProvider'
import {TeamMember} from 'auth/user'

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
          {/* owner */}
          <OwnerRow />
          {/* invites */}
          {memberInvites.map((invite) => (
            <InviteRow
              invite={invite}
              processing={processing}
              key={invite.id}
              onRemove={() => removeInvite(invite)}
              onResend={() => resendInvitation(invite)}
            />
          ))}
          {/* members */}
          {members.map((member) => (
            <MemberRow
              member={member}
              key={member.id}
              onRemove={() => removeTeamMember(member)}
              processing={processing}
            />
          ))}
        </TableBody>
      </Table>
    </>
  )
}

function OwnerRow() {
  const {owner} = useOwner()

  return (
    <TableRow>
      <TableCell>{owner.email}</TableCell>
      <TableCell>{owner.last_name}</TableCell>
      <TableCell>{owner.first_name}</TableCell>
      <TableCell>Owner</TableCell>
      <TableCell>{/* No action for owner */}</TableCell>
    </TableRow>
  )
}

function InviteRow(props: {
  invite: TeamInvitation
  processing: boolean
  onResend: () => void
  onRemove: () => void
}) {
  const {onRemove, invite, onResend, processing} = props

  return (
    <TableRow aria-label="team invitation">
      <TableCell>{invite.email}</TableCell>
      <TableCell>-</TableCell>
      <TableCell>-</TableCell>
      <TableCell>{invite.role?.name || '-'}</TableCell>
      <TableCell>
        <IconBox>
          <DeleteIconButton
            disabled={processing}
            onClick={onRemove}
            aria-label="remove team invitation"
          />
          <StyledResendButton
            disabled={processing}
            aria-label="resend invitation"
            onClick={onResend}
          />
        </IconBox>
      </TableCell>
    </TableRow>
  )
}

function MemberRow(props: {
  member: TeamMember
  onRemove: () => void
  processing: boolean
}) {
  const {member, onRemove, processing} = props

  return (
    <TableRow aria-label="team member">
      <TableCell>{member.email}</TableCell>
      <TableCell>{member.last_name}</TableCell>
      <TableCell>{member.first_name}</TableCell>
      <TableCell>
        <Role teamMember={member} />
      </TableCell>
      <TableCell>
        <DeleteIconButton
          disabled={processing}
          onClick={onRemove}
          aria-label="remove team member"
        />
      </TableCell>
    </TableRow>
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

const IconBox = styled.div`
  display: flex;
  align-items: center;
`

const StyledResendButton = styled(ResendButton)`
  margin-left: ${(props) => props.theme.spacing[1]};
`
