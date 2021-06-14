import TextField from '@material-ui/core/TextField'
import styled from 'styled-components'
import IfExists from 'lib/ui/layout/HasContent'
import React, {useState} from 'react'
import {useForm} from 'react-hook-form'
import Typography from '@material-ui/core/Typography'
import {ValidationError} from 'lib/api-client'
import Button from '@material-ui/core/Button'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import withStyles from '@material-ui/core/styles/withStyles'
import {spacing} from 'lib/ui/theme'
import {TeamMember} from 'auth/user'
import {
  TeamInvitation,
  useTeamInvitations,
} from 'organization/Team/TeamInvitationsProvider'
import {useTeam} from 'organization/Team/TeamProvider'

interface InviteData {
  email: string
}

export default function AddTeamMemberForm() {
  const {register, handleSubmit, errors, reset: resetForm} = useForm()
  const {add: addInvite} = useTeamInvitations()
  const {add: addMember} = useTeam()
  const [submitting, setSubmitting] = useState(false)
  const [responseError, setResponseError] = useState<
    ValidationError<InviteData>
  >(null)
  const inviteTeamMember = useInviteTeamMember()

  const submit = (data: InviteData) => {
    if (submitting) {
      return
    }

    setSubmitting(true)
    setResponseError(null)

    inviteTeamMember(data)
      .then((added) => {
        if (isInvitation(added)) {
          addInvite(added)
          return
        }

        addMember(added)
        resetForm()
      })
      .catch((e) => {
        setResponseError(e)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  return (
    <SyledForm onSubmit={handleSubmit(submit)}>
      <TextField
        label="Email"
        type="email"
        fullWidth
        variant="outlined"
        disabled={submitting}
        name="email"
        inputProps={{
          ref: register({
            required: 'Email is required',
          }),
          'aria-label': 'team member email',
        }}
        error={!!errors.email}
        helperText={errors.email && errors.email.message}
      />
      <IfExists Component={ErrorText} color="error">
        {responseError && responseError.message}
      </IfExists>
      <Button
        variant="outlined"
        type="submit"
        disabled={submitting}
        aria-label="add team member"
      >
        Invite
      </Button>
    </SyledForm>
  )
}

function useInviteTeamMember() {
  const {organization, client} = useOrganization()
  const url = api(`/organizations/${organization.slug}/team_members`)

  return (data: InviteData) =>
    client.post<TeamMember | TeamInvitation>(url, {email: data.email})
}

/**
 * Helper to check whether the returned data from an invite was a
 * Team Member (existing), or an invitation (account not found).
 *
 * @param data
 * @returns
 */
function isInvitation(
  data: TeamMember | TeamInvitation,
): data is TeamInvitation {
  /**
   * An invitation does NOT have name info
   */
  return !Object.prototype.hasOwnProperty.call(data, 'first_name')
}

const SyledForm = styled.form`
  padding: ${(props) => props.theme.spacing[5]};
  border: 1px solid ${(props) => props.theme.colors.border};
  margin-bottom: ${(props) => props.theme.spacing[5]};
`

const ErrorText = withStyles({
  root: {
    marginBottom: spacing[3],
  },
})(Typography)
