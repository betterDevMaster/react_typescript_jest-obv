import React, {useState} from 'react'
import {useObvioAuth} from 'obvio/auth'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import {colors} from 'lib/ui/theme'
import {obvioRoutes} from 'obvio/Routes'
import {useForm} from 'react-hook-form'
import Page, {
  Button,
  Description,
  Error,
  Link,
  TextField,
} from 'obvio/auth/Page'

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
    <Page>
      <div>WELCOME</div>
      <Description>Log into your account</Description>
      <form onSubmit={handleSubmit(submit)}>
        <TextField
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
        <TextField
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
        <Button
          variant="contained"
          fullWidth
          color="primary"
          disabled={submitting}
          aria-label="submit login"
          type="submit"
        >
          Login
        </Button>
      </form>
      <Link to={obvioRoutes.forgotPassword} aria-label="forgot password">
        <Description>Forgot Password?</Description>
      </Link>
      <CreateAccountText>
        Don't have an account yet?{' '}
        <Link to={obvioRoutes.registration} aria-label="create account">
          Create one now
        </Link>
      </CreateAccountText>
    </Page>
  )
}

export const CreateAccountText = withStyles({
  root: {
    color: colors.text.muted,
  },
})(Typography)
