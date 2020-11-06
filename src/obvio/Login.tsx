import Button from '@material-ui/core/Button/Button'
import TextField from '@material-ui/core/TextField'
import {setUser} from 'auth/actions'
import {onChangeStringHandler} from 'lib/dom'
import Centered from 'lib/ui/layout/Centered'
import {login} from 'obvio/user'
import React, {useState} from 'react'
import {useDispatch} from 'react-redux'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()

  const handleLogin = () => {
    login(email, password).then((user) => dispatch(setUser(user)))
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
        onClick={handleLogin}
      >
        Login
      </Button>
    </Centered>
  )
}
