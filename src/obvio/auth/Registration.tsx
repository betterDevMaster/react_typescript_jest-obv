import CenteredBox from 'lib/ui/layout/Center'
import styled from 'styled-components'
import React, {useState} from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import {useObvioAuth} from 'obvio/auth'
import Typography from '@material-ui/core/Typography'
import {obvioRoutes} from 'obvio/Routes'
import {spacing} from 'lib/ui/theme'
import withStyles from '@material-ui/core/styles/withStyles'
import Grid from '@material-ui/core/Grid'
import {useForm} from 'react-hook-form'
import {RegistrationData} from 'auth/auth-client'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import backgroundImg from 'assets/images/background_login.png'
import logoImgVertical from 'assets/images/logo_vertical.png'
import {useQueryParams} from 'lib/url'
import {fieldError} from 'lib/form'
import {ValidationError} from 'lib/ui/api-client'
import ErrorAlert from 'lib/ui/alerts/ErrorAlert'

export default function Registration() {
  const {register: registerForm, handleSubmit, errors, watch} = useForm()
  const [error, setError] = useState<ValidationError<RegistrationData> | null>(
    null,
  )
  const {token} = useQueryParams()

  const [submitting, setSubmitting] = useState(false)
  const {register} = useObvioAuth()

  const submit = (data: RegistrationData) => {
    setSubmitting(true)
    register({...data, token}).catch((e) => {
      setError(e)
      setSubmitting(false)
    })
  }

  const getError = (field: keyof RegistrationData) =>
    fieldError(field, {
      form: errors,
      response: error,
    })

  const tokenError = getError('token')
  const firstNameError = getError('firstName')
  const lastNameError = getError('lastName')
  const emailError = getError('email')
  const passwordError = getError('password')
  const passwordConfirmationError = getError('passwordConfirmation')

  return (
    <StyledCenteredBox>
      <Container>
        <Logo src={logoImgVertical} alt="logo_image" />
        <WelcomeText>WELCOME</WelcomeText>
        <Description>Create your Obvio account</Description>
        <form onSubmit={handleSubmit(submit)}>
          <StyledError>{tokenError}</StyledError>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                label="First Name"
                name="firstName"
                fullWidth
                variant="outlined"
                inputProps={{
                  ref: registerForm({
                    required: 'First name is required',
                  }),
                  'aria-label': 'first name',
                }}
                error={!!firstNameError}
                helperText={firstNameError}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                label="Last Name"
                name="lastName"
                fullWidth
                variant="outlined"
                inputProps={{
                  ref: registerForm({
                    required: 'Last name is required',
                  }),
                  'aria-label': 'last name',
                }}
                error={!!lastNameError}
                helperText={lastNameError}
              />
            </Grid>
          </Grid>
          <StyledTextField
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            name="email"
            inputProps={{
              ref: registerForm({
                required: 'Email is required',
              }),
              'aria-label': 'email',
            }}
            error={!!emailError}
            helperText={emailError}
          />
          <StyledTextField
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            name="password"
            inputProps={{
              ref: registerForm({
                required: 'Password is required',
              }),
              'aria-label': 'password',
            }}
            error={!!passwordError}
            helperText={passwordError}
          />
          <StyledTextField
            label="Confirm Password"
            type="password"
            fullWidth
            variant="outlined"
            name="passwordConfirmation"
            inputProps={{
              ref: registerForm({
                required: 'Password confirmation is required',
                validate: (value: any) =>
                  value === watch('password') || 'Passwords do not match',
              }),
              'aria-label': 'password confirmation',
            }}
            error={!!passwordConfirmationError}
            helperText={passwordConfirmationError}
          />
          <StyledButton
            variant="contained"
            fullWidth
            color="primary"
            type="submit"
            disabled={submitting}
            aria-label="register"
          >
            Register
          </StyledButton>
          <LoginText>
            Already have an account?{' '}
            <StyledRelativeLink to={obvioRoutes.login}>
              Login instead
            </StyledRelativeLink>
          </LoginText>
        </form>
      </Container>
    </StyledCenteredBox>
  )
}

const Logo = styled.img`
  margin-bottom: 50px;
`

const WelcomeText = styled.div``

const Description = styled.div`
  color: #2066a7;
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 30px;
`

const StyledCenteredBox = styled(CenteredBox)`
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

const LoginText = withStyles({
  root: {
    marginTop: spacing[3],
  },
})(Typography)

const StyledError = styled(ErrorAlert)`
  margin-bottom: ${(props) => props.theme.spacing[6]};
`
