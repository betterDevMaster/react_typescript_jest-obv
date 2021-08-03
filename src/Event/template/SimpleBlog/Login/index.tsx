import {LoginProps} from 'Event/auth/Login'
import styled from 'styled-components'
import React from 'react'
import {eventRoutes} from 'Event/Routes'
import Page, {
  Button,
  Description,
  ErrorMessage,
  TextField,
} from 'Event/template/SimpleBlog/Login/Page'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useSimpleBlog} from 'Event/template/SimpleBlog'

export default function Login(props: LoginProps) {
  const {template} = useSimpleBlog()
  const emailLabel = template.login.emailLabel
  const passwordLabel = template.login.passwordLabel

  return (
    <Page isPreview={props.isPreview}>
      <>
        <Description aria-label="event login description">
          {template.login.description.text}
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
              'aria-label': 'email',
            }}
            error={!!props.errors.email}
            helperText={props.errors.email && props.errors.email.message}
          />
          <TextField
            label={passwordLabel}
            type="password"
            fullWidth
            variant="outlined"
            name="password"
            disabled={props.submitting}
            inputProps={{
              ref: props.register({
                required: `${passwordLabel} is required`,
              }),
              'aria-label': 'password',
            }}
            error={!!props.errors.password}
            helperText={props.errors.password && props.errors.password.message}
          />
          <ErrorMessage>{props.error}</ErrorMessage>
          <Button
            variant="contained"
            fullWidth
            disabled={props.submitting}
            aria-label="submit login"
            type="submit"
          >
            {template.login.submitButton.label}
          </Button>
        </form>
        {props.isPreview ? null : (
          <StyledRelativeLink
            to={eventRoutes.forgotPassword}
            aria-label="forgot password"
            color={template.login.description.color}
          >
            {template.login.passwordReset.linkLabel}
          </StyledRelativeLink>
        )}
      </>
    </Page>
  )
}

export const StyledRelativeLink = styled(RelativeLink)<{color: string}>`
  margin-top: ${(props) => props.theme.spacing[10]};
  color: ${(props) => props.color};
`
