import React from 'react'
import {api} from 'lib/url'
import {obvioRoutes} from 'obvio/Routes'
import {useHistory} from 'react-router-dom'
import Page, {
  Description,
  TextField,
  Button,
  Error,
  BackButton,
} from 'obvio/auth/Page'
import {useResetPassword} from 'auth/password'

export default function ResetPassword() {
  const {
    submitting,
    onSubmit,
    responseError,
    register,
    errors,
    wasSuccessful,
  } = useResetPassword(api('/reset_password'))

  const history = useHistory()

  const goBacktoLogin = () => {
    history.push(obvioRoutes.login)
  }
  return (
    <Page>
      <Description>Reset Password</Description>
      {wasSuccessful === true ? (
        <>
          <h2>Password reset Successfully</h2>
          <BackButton
            variant="contained"
            fullWidth
            color="default"
            disabled={submitting}
            aria-label="back to login"
            type="button"
            onClick={() => {
              goBacktoLogin()
            }}
          >
            Go To Login
          </BackButton>
        </>
      ) : (
        <>
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
                'aria-label': 'obvio account password',
              }}
              error={!!errors.password}
              helperText={errors.password}
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
                'aria-label': 'obvio account password confirmation',
              }}
              error={!!errors.passwordConfirmation}
              helperText={errors.passwordConfirmation}
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
              Reset
            </Button>
          </form>
        </>
      )}
    </Page>
  )
}
