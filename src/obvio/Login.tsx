import Button from '@material-ui/core/Button/Button'
import styled from 'styled-components'
import TextField from '@material-ui/core/TextField'
import {onChangeStringHandler} from 'lib/dom'
import Centered from 'lib/ui/layout/Centered'
import React, {useState} from 'react'
import {useObvioAuth} from 'obvio/auth'
import Typography from '@material-ui/core/Typography'

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
      <Button
        variant="contained"
        fullWidth
        color="primary"
        onClick={tryLogin}
        disabled={submitting}
      >
        Login
      </Button>
      <Error>{error}</Error>
    </Centered>
  )
}

function Error(props: {children: string}) {
  if (!props.children) {
    return null
  }

  return <ErrorText color="error">{props.children}</ErrorText>
}

const ErrorText = styled(Typography)`
  margin-top: ${(props) => props.theme.spacing[3]};
`
