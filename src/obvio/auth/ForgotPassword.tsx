import React from 'react'
import {obvioUrl, api} from 'lib/url'
import {useHistory} from 'react-router-dom'
import {obvioRoutes} from 'obvio/Routes'
import Page, {
  Description,
  TextField,
  Button,
  Error,
  BackButton,
} from 'obvio/auth/Page'
import {useForgotPassword} from 'auth/password'

export default function ForgotPassword() {
  const {
    resetLinkSent,
    onSubmit,
    submitting,
    register,
    emailError,
    responseError,
  } = useForgotPassword({
    url: api('/forgot_password'),
    resetFormUrl: obvioUrl(obvioRoutes.resetPassword),
  })

  const history = useHistory()

  const goBacktoLogin = () => {
    history.push(obvioRoutes.login)
  }

  return (
    <Page>
      <Description>Forgot your password?</Description>
      {resetLinkSent === true ? (
        <div>'Email sent Successfully.'</div>
      ) : (
        <>
          <p>Please enter the email address associated with your account.</p>
          <form onSubmit={onSubmit}>
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
                'aria-label': 'obvio account email',
              }}
              error={!!emailError}
              helperText={emailError}
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
            <BackButton
              variant="contained"
              fullWidth
              color="default"
              aria-label="back to login"
              type="button"
              onClick={() => {
                goBacktoLogin()
              }}
            >
              Back
            </BackButton>
          </form>
        </>
      )}
    </Page>
  )
}
