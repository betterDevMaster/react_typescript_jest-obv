import React, {useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
import {useEvent} from 'Event/EventProvider'
import Center from 'lib/ui/layout/Center'
import Typography from '@material-ui/core/Typography'
import {useForm} from 'react-hook-form'
import {useEventAuth} from 'Event/auth'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import {useSearchParams} from 'lib/url'
import backgroundImg from 'assets/images/background_login.png'
import logoImgVertical from 'assets/images/logo_vertical.png'

export default function Login() {
  const {event} = useEvent()
  const {token} = useSearchParams()
  const {register, handleSubmit, errors} = useForm()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const {login} = useEventAuth()
  const hasAttemptedTokenLogin = useRef(false)

  const submit = (data: {email: string; password: string}) => {
    setSubmitting(true)
    login({
      email: data.email,
      password: data.password,
    }).catch((e) => {
      setError(e.message)
      setSubmitting(false)
    })
  }

  useEffect(() => {
    if (!token || hasAttemptedTokenLogin.current) {
      return
    }

    hasAttemptedTokenLogin.current = true
    setSubmitting(true)
    login({
      login_token: token,
    }).catch((e) => {
      setError(e.message)
      setSubmitting(false)
    })
  }, [token, login])

  return (
    <Background>
      <Container>
        <Logo src={logoImgVertical} alt="logo_image" />
        <div>WELCOME</div>
        <Description>Login to your {event.name} account</Description>
        <form onSubmit={handleSubmit(submit)}>
          <StyledTextField
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
              'aria-label': 'email',
            }}
            error={!!errors.email}
            helperText={errors.email && errors.email.message}
          />
          <StyledTextField
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            name="password"
            disabled={submitting}
            inputProps={{
              ref: register({
                required: 'Password is required',
              }),
              'aria-label': 'password',
            }}
            error={!!errors.password}
            helperText={errors.password && errors.password.message}
          />
          <ErrorMessage>{error}</ErrorMessage>
          <StyledButton
            variant="contained"
            fullWidth
            color="primary"
            disabled={submitting}
            aria-label="submit login"
            type="submit"
          >
            Login
          </StyledButton>
        </form>
      </Container>
    </Background>
  )
}

function ErrorMessage(props: {children: string}) {
  if (!props.children) {
    return null
  }

  return <ErrorText color="error">{props.children}</ErrorText>
}

const Logo = styled.img`
  margin-bottom: ${(props) => props.theme.spacing[12]};
`

const Description = styled.div`
  color: ${(props) => props.theme.colors.secondary};
  font-size: 20px;
  font-weight: 500;
  margin-bottom: ${(props) => props.theme.spacing[8]};
`

const Background = styled(Center)`
  background: url(${backgroundImg});
  background-size: cover;
  background-position: center;
`

const StyledTextField = styled(TextField)`
  border-radius: 14px;
  background: #f2f5f9;
  fieldset {
    border: none;
  }
`

const StyledButton = styled(Button)`
  border-radius: 14px !important;
  height: 50px;
`

const Container = styled.div`
  width: 100%;
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
