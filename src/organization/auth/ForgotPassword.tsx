import React from 'react'
import {useOrganization} from 'organization/OrganizationProvider'
import {api, obvioUrl} from 'lib/url'
import Page, {TextField, Error, Button} from 'organization/auth/Page'
import {useForgotPassword} from 'auth/password'

export default function ForgotPassword() {
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

  return (
    <Page>
      {resetLinkSent === true ? (
        <div>'Email sent Successfully! Please check email.'</div>
      ) : (
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
        </form>
      )}
    </Page>
  )
}
