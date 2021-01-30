import React, {useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
import Center from 'lib/ui/layout/Center'
import Typography from '@material-ui/core/Typography'
import {useForm} from 'react-hook-form'
import {useEventAuth} from 'Event/auth'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import {useSearchParams} from 'lib/url'

const backgroundImg =
  'https://obv-public.s3.amazonaws.com/the_virtual_event_on_virtual_events/images/Login/Main_Login_BG.jpg'

const logoImgVertical =
  'https://obv-public.s3.amazonaws.com/the_virtual_event_on_virtual_events/images/Logos/TVE_white_Logo.png'

export default function Login() {
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
        <Form onSubmit={handleSubmit(submit)}>
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
            disabled={submitting}
            aria-label="submit login"
            type="submit"
          >
            Login
          </StyledButton>
        </Form>
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
  width: 100%;
  margin-bottom: ${(props) => props.theme.spacing[12]};
`

const Form = styled.form`
  width: 100%;
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
  background: #f6c55c !important;
  color: #ffffff !important;
`

const Container = styled.div`
  width: 100%;
  max-width: 660px;
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
