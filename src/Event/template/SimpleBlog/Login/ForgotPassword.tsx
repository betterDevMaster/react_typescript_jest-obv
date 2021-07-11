import React from 'react'

import Page, {
  Button,
  Description,
  TextField,
  ErrorMessage,
} from 'Event/template/SimpleBlog/Login/Page'
import {ForgotPasswordProps} from 'auth/password'
import {useSimpleBlog} from 'Event/template/SimpleBlog'
import {DEFAULT_EMAIL_LABEL} from 'Event/template/SimpleBlog/Login'

export default function ForgotPassword(props: ForgotPasswordProps) {
  return (
    <Page isPreview={false}>
      <Content {...props} />
    </Page>
  )
}

export function Content(props: ForgotPasswordProps) {
  const {template} = useSimpleBlog()
  const emailLabel = template.login.emailLabel || DEFAULT_EMAIL_LABEL

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
          label={emailLabel}
          type="email"
          fullWidth
          variant="outlined"
          name="email"
          disabled={props.submitting}
          inputProps={{
            ref: props.register({
              required: `${emailLabel} is required`,
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
