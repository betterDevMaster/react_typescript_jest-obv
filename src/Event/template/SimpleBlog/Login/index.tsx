import {LoginProps} from 'Event/auth/Login'
import {useEvent} from 'Event/EventProvider'
import styled from 'styled-components'
import React from 'react'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import defaultLogo from 'assets/images/logo_vertical.png'
import defaultBackground from 'assets/images/background_login.png'
import {useTemplate} from 'Event/Dashboard/state/TemplateProvider'

export default function Login(props: LoginProps) {
  const {event} = useEvent()

  const background = event.login_background
    ? event.login_background.url
    : defaultBackground
  const logo = event.login_logo ? event.login_logo.url : defaultLogo

  const template = useTemplate()

  return (
    <LoginBackground
      background={background}
      isPreview={props.isPreview}
      aria-label="login background"
    >
      <Container>
        <Logo src={logo} alt={event.name} aria-label="login logo" />
        <Description
          color={template.login.description.color}
          fontSize={template.login.description.fontSize}
          aria-label="event login description"
        >
          {template.login.description.text}
        </Description>
        <form onSubmit={props.onSubmit}>
          <StyledTextField
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
          <StyledTextField
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
          <StyledButton
            variant="contained"
            fullWidth
            backgroundColor={template.login.submitButton.backgroundColor}
            color={template.login.submitButton.textColor}
            disabled={props.submitting}
            aria-label="submit login"
            type="submit"
          >
            {template.login.submitButton.label}
          </StyledButton>
        </form>
      </Container>
    </LoginBackground>
  )
}

function Description(props: {
  children: string
  color: string
  fontSize: number
  'aria-label': string
}) {
  if (!props.children) {
    return null
  }

  return <DescriptionText {...props} />
}

function ErrorMessage(props: {children: string}) {
  if (!props.children) {
    return null
  }

  return <ErrorText color="error">{props.children}</ErrorText>
}

const Logo = styled.img`
  margin-bottom: ${(props) => props.theme.spacing[12]};
  max-height: 150px;
  max-width: 200px;
`

const DescriptionText = styled.div<{color?: string | null; fontSize: number}>`
  color: ${(props) => props.color};
  font-size: ${(props) => props.fontSize}px;
  font-weight: 500;
  margin-bottom: ${(props) => props.theme.spacing[8]};
`

const LoginBackground = styled.div<{
  background: string
  isPreview?: boolean
}>`
  background: url(${(props) => props.background});
  background-size: cover;
  background-position: center;
  position: ${(props) => (props.isPreview ? 'inherit' : 'absolute')};
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyledTextField = styled(TextField)`
  border-radius: ${(props) => props.theme.spacing[14]};
  background: #f2f5f9;
  fieldset {
    border: none;
  }
`
const StyledButton = styled(({color, backgroundColor, ...otherProps}) => (
  <Button {...otherProps} />
))`
  border-radius: ${(props) => props.theme.spacing[14]} !important;
  height: 50px;
  color: ${(props) => props.color} !important;
  background-color: ${(props) => props.backgroundColor} !important;
`
const Container = styled.div`
  width: auto;
  padding: ${(props) => props.theme.spacing[4]};
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: ${(props) => props.theme.breakpoints.sm}) {
    width: 600px;
  }
`

const ErrorText = styled(Typography)`
  margin-bottom: ${(props) => props.theme.spacing[3]};
`
