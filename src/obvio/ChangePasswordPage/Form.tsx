import React from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import {api} from 'lib/url'
import {useValidatedForm} from 'lib/form'
import {teamMemberClient} from 'obvio/obvio-client'
import {useObvioAuth} from 'obvio/auth'
import {useToggle} from 'lib/toggle'
import ErrorAlert from 'lib/ui/alerts/ErrorAlert'

type ChangePasswordData = {
  password: string
  new_password: string
  new_password_confirmation: string
}

export default function Form() {
  const {flag: submitting, toggle: toggleSubmitting} = useToggle()

  const {
    register,
    errors,
    handleSubmit,
    responseError,
    setResponseError,
    clearErrors,
  } = useValidatedForm<ChangePasswordData>()

  const {logout} = useObvioAuth()

  const submit = (data: ChangePasswordData) => {
    if (submitting) {
      return
    }

    toggleSubmitting()
    clearErrors()

    teamMemberClient
      .put(api('/password'), data)
      .then(logout)
      .catch((e) => {
        setResponseError(e)
        toggleSubmitting()
      })
  }

  return (
    <>
      <StyledErrorAlert>{responseError?.message}</StyledErrorAlert>
      <form onSubmit={handleSubmit(submit)}>
        <TextField
          label="Current Password"
          type="password"
          fullWidth
          variant="outlined"
          disabled={submitting}
          name="password"
          inputProps={{
            ref: register({
              required: 'Current Password is required',
            }),
            'aria-label': 'current password',
          }}
          error={Boolean(errors.password)}
          helperText={errors.password}
        />
        <TextField
          label="New Password"
          type="password"
          fullWidth
          variant="outlined"
          disabled={submitting}
          name="new_password"
          inputProps={{
            ref: register({
              required: 'New Password is required',
            }),
            'aria-label': 'new password',
          }}
          error={Boolean(errors.new_password)}
          helperText={errors.new_password}
        />
        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          variant="outlined"
          disabled={submitting}
          name="new_password_confirmation"
          inputProps={{
            ref: register({
              required: 'Confirm Password is required',
            }),
            'aria-label': 'password confirmation',
          }}
          error={Boolean(errors.new_password_confirmation)}
          helperText={errors.new_password_confirmation}
        />
        <Button
          variant="contained"
          fullWidth
          color="primary"
          disabled={submitting}
          aria-label="submit change password"
          type="submit"
        >
          Change Password
        </Button>
      </form>
    </>
  )
}

const StyledErrorAlert = styled(ErrorAlert)`
  margin-bottom: ${(props) => props.theme.spacing[5]};
`
