import React from 'react'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import {useHistory} from 'react-router-dom'
import Page, {
  Description,
  TextField,
  Error,
  Button,
} from 'organization/auth/Page'
import {useResetPassword} from 'auth/password'

export default function ResetPassword() {
  const {organization, routes} = useOrganization()
  const history = useHistory()

  const {
    submitting,
    onSubmit,
    responseError,
    register,
    errors,
    wasSuccessful,
  } = useResetPassword(
    api(`/organizations/${organization.slug}/reset_password`),
  )

  const goBacktoLogin = () => {
    history.push(routes.login)
  }

  return (
    <Page>
      <Description>Reset Password for {organization.name} account.</Description>
      {wasSuccessful === true ? (
        <>
          <h2>Password reset successfully</h2>
          <Button
            variant="contained"
            fullWidth
            color="primary"
            aria-label="back to login"
            type="submit"
            onClick={() => {
              goBacktoLogin()
            }}
          >
            Go To Login
          </Button>
        </>
      ) : (
        <form onSubmit={onSubmit}>
          <TextField
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            disabled={submitting}
            name="password"
            inputProps={{
              ref: register({
                required: 'Password is required',
              }),
              'aria-label': 'organization account password',
            }}
            error={!!errors.password}
            helperText={errors.password && errors.password}
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            variant="outlined"
            disabled={submitting}
            name="password_confirmation"
            inputProps={{
              ref: register({
                required: 'Password confirmation is required',
              }),
              'aria-label': 'organization account password confirmation',
            }}
            error={!!errors.password}
            helperText={errors.password && errors.password}
          />
          <Error>{responseError?.message}</Error>
          <Button
            variant="contained"
            fullWidth
            color="primary"
            disabled={submitting}
            aria-label="submit reset password"
            type="submit"
          >
            Reset Password
          </Button>
        </form>
      )}
    </Page>
  )
}
