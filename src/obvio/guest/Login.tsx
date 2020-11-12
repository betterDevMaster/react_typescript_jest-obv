import Button from '@material-ui/core/Button/Button'
import styled from 'styled-components'
import TextField from '@material-ui/core/TextField'
import {onChangeStringHandler} from 'lib/dom'
import Centered from 'lib/ui/layout/Centered'
import React, {useState} from 'react'
import {useObvioAuth} from 'obvio/auth'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import {spacing} from 'lib/ui/theme'
import {obvioRoutes} from 'obvio/Routes'
import {RelativeLink} from 'lib/ui/link/RelativeLink'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const {login} = useObvioAuth()

  const tryLogin = () => {
    setSubmitting(true)
    login(email, password).catch((e) => {
      const message = e.message || e
      setError(message)
      setSubmitting(false)
    })
  }

  return (
    <Centered>
      <Container>
        <TextField
          label="Email"
          type="email"
          fullWidth
          variant="outlined"
          onChange={onChangeStringHandler(setEmail)}
          value={email}
          inputProps={{
            'aria-label': 'obvio account email',
          }}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          variant="outlined"
          onChange={onChangeStringHandler(setPassword)}
          value={password}
          inputProps={{
            'aria-label': 'obvio account password',
          }}
        />
        <Error>{error}</Error>
        <Button
          variant="contained"
          fullWidth
          color="primary"
          onClick={tryLogin}
          disabled={submitting}
          aria-label="submit login"
        >
          Login
        </Button>
        <CreateAccountText>
          Don't have an account yet?{' '}
          <RelativeLink to={obvioRoutes.registration}>
            Create one now
          </RelativeLink>
        </CreateAccountText>
      </Container>
    </Centered>
  )
}

function Error(props: {children: string}) {
  if (!props.children) {
    return null
  }

  return <ErrorText color="error">{props.children}</ErrorText>
}

const Container = styled.div`
  width: 100%;
  padding: ${(props) => props.theme.spacing[4]};

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
  },
})(Typography)
