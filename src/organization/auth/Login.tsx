import Button from '@material-ui/core/Button/Button'
import styled from 'styled-components'
import TextField from '@material-ui/core/TextField'
import {onChangeStringHandler} from 'lib/dom'
import Centered from 'lib/ui/layout/Centered'
import React, {useState} from 'react'
import Typography from '@material-ui/core/Typography'
import {spacing} from 'lib/ui/theme'
import {useOrganizationAuth} from 'organization/auth'
import {useOrganization} from 'organization/OrganizationProvider'
import withStyles from '@material-ui/core/styles/withStyles'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const {login} = useOrganizationAuth()
  const {organization} = useOrganization()

  const tryLogin = () => {
    setSubmitting(true)
    login(email, password).catch((e) => {
      const message = e.message || e
      setError(message)
      setSubmitting(false)
    })
  }

  if (!organization) {
    throw new Error('Missing Organization')
  }

  return (
    <Centered>
      <Container>
        <OrganizationName variant="h5">{organization.name}</OrganizationName>
        <TextField
          label="Email"
          type="email"
          fullWidth
          variant="outlined"
          onChange={onChangeStringHandler(setEmail)}
          value={email}
          inputProps={{
            'aria-label': 'email',
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
            'aria-label': 'password',
          }}
        />
        <ErrorMessage>{error}</ErrorMessage>
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
      </Container>
    </Centered>
  )
}

function ErrorMessage(props: {children: string}) {
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

const OrganizationName = withStyles({
  root: {
    textAlign: 'center',
    marginBottom: spacing[3],
  },
})(Typography)
