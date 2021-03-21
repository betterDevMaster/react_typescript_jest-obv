import React from 'react'

import Page, {
  Button,
  Description,
  TextField,
  ErrorMessage,
} from 'Event/template/SimpleBlog/Login/Page'
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
    return <h3>Email sent successfully! Please check email.</h3>
  }

  return (
    <>
      <Description aria-label="event login description">
        Can't remember your password?
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
