import React from 'react'
import {obvioUrl, api} from 'lib/url'
import {obvioRoutes} from 'obvio/Routes'
import Page, {
  Description,
  TextField,
  Button,
  Error,
  BackButton,
} from 'obvio/auth/Page'
import {useForgotPassword} from 'auth/password'
import Typography from '@material-ui/core/Typography'
import {RelativeLink} from 'lib/ui/link/RelativeLink'

export default function ForgotPassword() {
  return (
    <Page>
      <Content />
    </Page>
  )
}

function Content() {
  const {
    resetLinkSent,
    onSubmit,
    submitting,
    register,
    emailError,
    responseError,
  } = useForgotPassword({
    url: api('/forgot_password'),
    resetFormUrl: obvioUrl(obvioRoutes.reset_password),
  })

  if (resetLinkSent) {
    return (
      <Typography>
        Password reset link sent! Check your spam folder if you don't see it
        after a couple minutes.
      </Typography>
    )
  }

  return (
    <>
      <Description aria-label="event login description">
        Send password reset link
      </Description>
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
        <RelativeLink to={obvioRoutes.login} disableStyles>
          <BackButton
            variant="outlined"
            fullWidth
            color="default"
            aria-label="back to login"
            type="button"
          >
            Back
          </BackButton>
        </RelativeLink>
      </form>
    </>
  )
}
