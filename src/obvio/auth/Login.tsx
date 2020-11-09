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
import {Link} from 'react-router-dom'
import {ROUTES} from 'obvio/Routes'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {login} = useObvioAuth()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const tryLogin = () => {
    setSubmitting(true)
    login(email, password)
      .catch((e) => {
        const message = e.message || e
        setError(message)
      })
      .finally(() => {
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
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          variant="outlined"
          onChange={onChangeStringHandler(setPassword)}
        />
        <Error>{error}</Error>
        <Button
          variant="contained"
          fullWidth
          color="primary"
          onClick={tryLogin}
          disabled={submitting}
        >
          Login
        </Button>
        <CreateAccountText>
          Don't have an account yet?{' '}
          <Link to={ROUTES.registration}>Create one now</Link>
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
