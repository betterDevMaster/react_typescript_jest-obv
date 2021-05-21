import CenteredBox from 'lib/ui/layout/Center'
import styled from 'styled-components'
import React, {useState} from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import {useObvioAuth} from 'obvio/auth/index'
import Grid from '@material-ui/core/Grid'
import {useForm} from 'react-hook-form'
import backgroundImg from 'assets/images/background_login.png'
import logoImgVertical from 'assets/images/logo_vertical.png'
import {api, useQueryParams} from 'lib/url'
import {client} from 'lib/api-client'
import {TeamMember} from 'auth/user'
import ErrorAlert from 'lib/ui/alerts/ErrorAlert'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import {spacing} from 'lib/ui/theme'

type AcceptInvitationData = {
  first_name: string
  last_name: string
  password: string
  password_confirmation: string
}

export default function AcceptInvitation() {
  const {register: registerForm, handleSubmit, errors, watch} = useForm()
  const [error, setError] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const {token} = useQueryParams()
  const {login} = useObvioAuth()

  const submit = (data: AcceptInvitationData) => {
    setSubmitting(true)

    const withToken = {
      ...data,
      token,
    }

    const url = api(`/team_invitations/accept`)
    client
      .post<TeamMember>(url, withToken)
      .then((teamMember) => {
        login({
          email: teamMember.email,
          password: data.password,
        }).catch((e) => {
          setError(e.message)
          setSubmitting(false)
        })
      })
      .catch((e) => {
        setSubmitting(false)
        setError(e.message)
      })
  }

  return (
    <StyledCenteredBox>
      <Container>
        <ErrorAlert>{error}</ErrorAlert>
        <Logo src={logoImgVertical} alt="logo_image" />
        <WelcomeText variant="h6">Create your account</WelcomeText>
        <form onSubmit={handleSubmit(submit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                label="First Name"
                name="first_name"
                fullWidth
                variant="outlined"
                inputProps={{
                  ref: registerForm({
                    required: 'First name is required',
                  }),
                  'aria-label': 'first name',
                }}
                error={!!errors.first_name}
                helperText={errors.first_name && errors.first_name.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                label="Last Name"
                name="last_name"
                fullWidth
                variant="outlined"
                inputProps={{
                  ref: registerForm({
                    required: 'Last name is required',
                  }),
                  'aria-label': 'last name',
                }}
                error={!!errors.last_name}
                helperText={errors.last_name && errors.last_name.message}
              />
            </Grid>
          </Grid>
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
            error={!!errors.password}
            helperText={errors.password && errors.password.message}
          />
          <StyledTextField
            label="Confirm Password"
            type="password"
            fullWidth
            variant="outlined"
            name="password_confirmation"
            inputProps={{
              ref: registerForm({
                required: 'Password confirmation is required',
                validate: (value: any) =>
                  value === watch('password') || 'Passwords do not match',
              }),
              'aria-label': 'password confirmation',
            }}
            error={!!errors.passwordConfirmation}
            helperText={
              errors.passwordConfirmation && errors.passwordConfirmation.message
            }
          />
          <StyledButton
            variant="contained"
            fullWidth
            color="primary"
            type="submit"
            disabled={submitting}
            aria-label="create account"
          >
            Create Account
          </StyledButton>
        </form>
      </Container>
    </StyledCenteredBox>
  )
}

const Logo = styled.img`
  margin-bottom: 50px;
`

const WelcomeText = withStyles({
  root: {
    marginBottom: spacing[4],
  },
})(Typography)

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
