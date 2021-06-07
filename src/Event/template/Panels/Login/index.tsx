import {LoginProps} from 'Event/auth/Login'
import styled from 'styled-components'
import React from 'react'
import {eventRoutes} from 'Event/Routes'
import Page, {
  Button,
  Description,
  ErrorMessage,
  TextField,
} from 'Event/template/Panels/Login/Page'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {usePanels} from 'Event/template/Panels'
import {DEFAULT_LOGIN_CONFIG} from 'Event/template/Panels/Login/LoginConfig'

export default function Login(props: LoginProps) {
  const {template} = usePanels()
  const login = template.login ? template.login : DEFAULT_LOGIN_CONFIG
  return (
    <Page isPreview={props.isPreview}>
      <>
        <Description aria-label="event login description">
          {login.description.text}
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
              'aria-label': 'email',
            }}
            error={!!props.errors.email}
            helperText={props.errors.email && props.errors.email.message}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            name="password"
            disabled={props.submitting}
            inputProps={{
              ref: props.register({
                required: 'Password is required',
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
            {login.submitButton.label}
          </Button>
        </form>
        {props.isPreview ? null : (
          <StyledRelativeLink
            to={eventRoutes.forgot_password}
            aria-label="forgot password"
            color={login.description.color}
          >
            Forgot Password?
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
