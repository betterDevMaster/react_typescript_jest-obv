import React from 'react'
import {useOrganization} from 'organization/OrganizationProvider'
import {api, obvioUrl} from 'lib/url'
import Page, {
  TextField,
  Error,
  Button,
  BackButton,
} from 'organization/auth/Page'
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
  const {organization, routes} = useOrganization()

  const {
    resetLinkSent,
    onSubmit,
    submitting,
    register,
    emailError,
    responseError,
  } = useForgotPassword({
    url: api(`/organizations/${organization.slug}/forgot_password`),
    resetFormUrl: obvioUrl(routes.reset_password),
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
      <form onSubmit={onSubmit}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          variant="outlined"
          name="email"
          disabled={submitting}
          inputProps={{
            ref: register({
              required: 'Email is required',
            }),
            'aria-label': 'organiztion account email',
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
        <RelativeLink to={routes.login} disableStyles>
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
