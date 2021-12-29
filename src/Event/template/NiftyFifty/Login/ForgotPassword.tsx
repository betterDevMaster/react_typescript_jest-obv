import React from 'react'
import styled from 'styled-components'

import Page, {
  Button,
  Description,
  TextField,
  ErrorMessage,
} from 'Event/template/NiftyFifty/Login/Page'

import {ForgotPasswordProps} from 'auth/password'

import {useGuestVariables} from 'Event'
import {eventRoutes} from 'Event/Routes'
import {useNiftyFiftyTemplate} from 'Event/template/NiftyFifty'

import {RelativeLink} from 'lib/ui/link/RelativeLink'

export default function ForgotPassword(props: ForgotPasswordProps) {
  return (
    <Page isPreview={false}>
      <Content {...props} />
    </Page>
  )
}

export function Content(props: ForgotPasswordProps) {
  const template = useNiftyFiftyTemplate()
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
    <Container>
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
          {v(login.passwordReset.buttonText)}
        </Button>
        <LoginContent>
          <StyledRelativeLink
            to={eventRoutes.login}
            aria-label="login"
            color={login.description.color}
          >
            {v(login.submitButton.label)}
          </StyledRelativeLink>
        </LoginContent>
      </form>
    </Container>
  )
}

const Container = styled.div`
  padding: ${(props) => props.theme.spacing[10]};
  margin: auto;
  height: 70vh;
`
const StyledRelativeLink = styled(RelativeLink)<{color: string}>`
  color: ${(props) => props.color};
`
const LoginContent = styled.div`
  width: 100%;
  padding: 0.5rem;
  text-align: right;
`
