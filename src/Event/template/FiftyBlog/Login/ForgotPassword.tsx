import React from 'react'

import Page, {
  Button,
  Description,
  TextField,
  ErrorMessage,
} from 'Event/template/FiftyBlog/Login/Page'
import {ForgotPasswordProps} from 'auth/password'
import {useFiftyBlogTemplate} from 'Event/template/FiftyBlog'
import {useGuestVariables} from 'Event'

export default function ForgotPassword(props: ForgotPasswordProps) {
  return (
    <Page isPreview={false}>
      <Content {...props} />
    </Page>
  )
}

export function Content(props: ForgotPasswordProps) {
  const template = useFiftyBlogTemplate()
  const {login} = template
  const v = useGuestVariables()

  const emailLabel = v(login.emailLabel)

  if (props.resetLinkSent) {
    return (
      <Description aria-label="password reset link sent">
        {v(login.passwordReset.successMessage)}
      </Description>
    )
  }

  return (
    <>
      <Description aria-label="event login description">
        {v(login.passwordReset.description)}
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
          {v(login.passwordReset.linkUrl)}
        </Button>
      </form>
    </>
  )
}
