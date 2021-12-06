import TextField from '@material-ui/core/TextField'
import styled from 'styled-components'
import React, {useState} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {ValidationError} from 'lib/api-client'
import Button from '@material-ui/core/Button'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import {TeamMember} from 'auth/user'
import {
  TeamInvitation,
  useTeamInvitations,
} from 'organization/Team/TeamInvitationsProvider'
import {useTeam} from 'organization/Team/TeamProvider'
import {onUnknownChangeHandler} from 'lib/dom'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import {useRoles} from 'organization/Team/Roles/RolesProvider'
import Grid from '@material-ui/core/Grid'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import ErrorAlert from 'lib/ui/alerts/ErrorAlert'

interface InviteData {
  email: string
  role_id: number
}

export default function AddTeamMemberForm() {
  const {control, register, handleSubmit, errors, reset: resetForm} = useForm()
  const {add: addInvite} = useTeamInvitations()
  const {add: addMember} = useTeam()
  const [submitting, setSubmitting] = useState(false)
  const [responseError, setResponseError] = useState<
    ValidationError<InviteData>
  >(null)
  const inviteTeamMember = useInviteTeamMember()
  const {roles} = useRoles()

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
      <ErrorAlert>{responseError?.message}</ErrorAlert>
      <Grid container spacing={2}>
        <Grid item md={10}>
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
        </Grid>
        <Grid item md={2}>
          <Controller
            control={control}
            name="role_id"
            label="Role"
            defaultValue={''}
            render={({value, onChange}) => (
              <FormControl fullWidth>
                <InputLabel variant="outlined" shrink>
                  Role
                </InputLabel>
                <Select
                  required
                  fullWidth
                  variant="outlined"
                  disabled={submitting}
                  /**
                   * Mui Select does NOT recognize NULL values, so we'll
                   * have to use 0 as a workaround.
                   */
                  value={value || 0}
                  displayEmpty={true}
                  onChange={onUnknownChangeHandler((val) =>
                    /**
                     * Handle our workaround, and set as NULL for the
                     * request to be correct.
                     */
                    onChange(val || null),
                  )}
                  inputProps={{
                    'aria-label': 'team member role',
                  }}
                >
                  <MenuItem value={0}>None</MenuItem>
                  {roles.map((role) => (
                    <MenuItem
                      value={role.id}
                      aria-label={`pick ${role.name}`}
                      key={role.id}
                    >
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Grid>
      </Grid>
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
  const url = api(`/organizations/${organization.id}/team_members`)

  return (data: InviteData) =>
    client.post<TeamMember | TeamInvitation>(url, {
      email: data.email,
      role_id: data.role_id,
    })
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
