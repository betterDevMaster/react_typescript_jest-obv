import React, {useState} from 'react'
import {useOrganizationAuth} from 'organization/auth'
import {useOrganization} from 'organization/OrganizationProvider'
import {useForm} from 'react-hook-form'
import Page, {
  Description,
  TextField,
  Error,
  Button,
  Link,
} from 'organization/auth/Page'

export default function Login() {
  const {register, handleSubmit, errors} = useForm()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const {organization, routes} = useOrganization()
  const {login} = useOrganizationAuth()

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
      <Description>Login to your {organization.name} account</Description>
      <form onSubmit={handleSubmit(submit)}>
        <TextField
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
        <TextField
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
      <Link to={routes.forgot_password} aria-label="forgot password">
        Forgot Password?
      </Link>
    </Page>
  )
}
