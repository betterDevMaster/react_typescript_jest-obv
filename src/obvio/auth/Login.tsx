import Button from '@material-ui/core/Button/Button'
import styled from 'styled-components'
import TextField from '@material-ui/core/TextField'
import Center from 'lib/ui/layout/Center'
import React, {useState} from 'react'
import {useObvioAuth} from 'obvio/auth'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import {colors, spacing} from 'lib/ui/theme'
import {obvioRoutes} from 'obvio/Routes'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useForm} from 'react-hook-form'
import backgroundImg from 'assets/images/background_login.png'
import logoImgVertical from 'assets/images/logo_vertical.png'

export default function Login() {
  const {register, handleSubmit, errors} = useForm()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const {login} = useObvioAuth()

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

  return (
    <Background>
      <Container>
        <Logo src={logoImgVertical} alt="logo_image" />
        <div>WELCOME</div>
        <Description>Log into your account</Description>
        <form onSubmit={handleSubmit(submit)}>
          <StyledTextField
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            disabled={submitting}
            name="email"
            inputProps={{
              ref: register({
                required: 'Email is required',
              }),
              'aria-label': 'obvio account email',
            }}
            error={!!errors.email}
            helperText={errors.email && errors.email.message}
          />
          <StyledTextField
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            disabled={submitting}
            name="password"
            inputProps={{
              ref: register({
                required: 'Password is required',
              }),
              'aria-label': 'obvio account password',
            }}
            error={!!errors.password}
            helperText={errors.password && errors.password.message}
          />
          <Error>{error}</Error>
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
        <CreateAccountText>
          Don't have an account yet?{' '}
          <StyledRelativeLink
            to={obvioRoutes.registration}
            aria-label="create account"
          >
            Create one now
          </StyledRelativeLink>
        </CreateAccountText>
      </Container>
    </Background>
  )
}

function Error(props: {children: string}) {
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

const StyledRelativeLink = styled(RelativeLink)`
  color: #2066a7;
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

const CreateAccountText = withStyles({
  root: {
    marginTop: spacing[3],
    color: colors.text.muted,
  },
})(Typography)
