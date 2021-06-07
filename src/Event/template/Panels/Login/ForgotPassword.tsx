import React from 'react'

import Page, {
  Button,
  Description,
  TextField,
  ErrorMessage,
} from 'Event/template/Panels/Login/Page'
import {ForgotPasswordProps} from 'auth/password'

export default function ForgotPassword(props: ForgotPasswordProps) {
  return (
    <Page isPreview={false}>
      <Content {...props} />
    </Page>
  )
}

export function Content(props: ForgotPasswordProps) {
  if (props.resetLinkSent) {
    return (
      <Description aria-label="password reset link sent">
        Password reset link sent! Check your spam folder if you don't see it
        after a couple minutes.
      </Description>
    )
  }

  return (
    <>
      <Description aria-label="event login description">
        Send password reset link
      </Description>
      <form onSubmit={props.onSubmit}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          variant="outlined"
          name="email"
          disabled={props.submitting}
          inputProps={{
            ref: props.register({
              required: 'Email is required',
            }),
            'aria-label': 'event account email',
          }}
          error={!!props.emailError}
          helperText={props.emailError}
        />
        <ErrorMessage>{props.responseError?.message}</ErrorMessage>
        <Button
          variant="contained"
          fullWidth
          disabled={props.submitting}
          aria-label="submit reset password"
          type="submit"
        >
          Send Reset Password Link
        </Button>
      </form>
    </>
  )
}
