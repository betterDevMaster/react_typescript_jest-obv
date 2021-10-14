import React from 'react'
import Page, {
  Button,
  Description,
  TextField,
  ErrorMessage,
  StyledPaper,
  StyledFormContainer,
} from 'Event/template/Cards/Login/Page'
import {ResetPasswordProps} from 'auth/password'

export default function ResetPassword(props: ResetPasswordProps) {
  return (
    <Page isPreview={false}>
      <StyledPaper>
        <StyledFormContainer>
          <Content {...props} />
        </StyledFormContainer>
      </StyledPaper>
    </Page>
  )
}

function Content(props: ResetPasswordProps) {
  if (props.wasSuccessful) {
    return (
      <>
        <Description aria-label="event login description">
          Password reset Successfully
        </Description>
        <Button
          variant="contained"
          fullWidth
          aria-label="back to login"
          type="submit"
          onClick={props.goBacktoLogin}
        >
          Go To Login
        </Button>
      </>
    )
  }

  return (
    <>
      <Description>Let's get you a new password</Description>
      <form onSubmit={props.onSubmit}>
        <input
          type="hidden"
          name="email"
          ref={props.register}
          defaultValue={props.email}
        />
        <TextField
          label="New Password"
          type="password"
          fullWidth
          variant="outlined"
          name="password"
          disabled={props.submitting}
          inputProps={{
            ref: props.register({
              required: 'Password is required',
            }),
            'aria-label': 'event account password',
          }}
          error={!!props.errors.password}
          helperText={props.errors.password}
        />
        <TextField
          label="Confirm New Password"
          type="password"
          fullWidth
          variant="outlined"
          name="password_confirmation"
          disabled={props.submitting}
          inputProps={{
            ref: props.register({
              required: 'Password confirmation is required',
            }),
            'aria-label': 'event account password confirmation',
          }}
          error={!!props.errors.passwordConfirmation}
          helperText={props.errors.passwordConfirmation}
        />
        <ErrorMessage>{props.responseError?.message}</ErrorMessage>
        <Button
          variant="contained"
          fullWidth
          disabled={props.submitting}
          aria-label="submit reset password"
          type="submit"
        >
          Set password
        </Button>
      </form>
    </>
  )
}
