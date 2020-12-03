import {Container} from '@material-ui/core'
import styled from 'styled-components'
import {useEvent} from 'Event/EventProvider'
import React, {useState} from 'react'
import Typography from '@material-ui/core/Typography/'
import TextField from '@material-ui/core/TextField'
import {useForm} from 'react-hook-form'
import Button from '@material-ui/core/Button'
import {api} from 'lib/url'
import {Attendee} from 'Event/attendee'
import {ValidationError} from 'lib/api-client'
import withStyles from '@material-ui/core/styles/withStyles'
import {spacing} from 'lib/ui/theme'
import {setUser} from 'auth/actions'
import {useDispatch} from 'react-redux'

interface SetPasswordData {
  password: string
  password_confirmation: string
}

export default function SetPasswordForm() {
  const {event} = useEvent()
  const {register, handleSubmit, errors, watch} = useForm()
  const [submitting, setSubmitting] = useState(false)
  const [responseError, setResponseError] = useState<null | ValidationError<
    SetPasswordData
  >>(null)
  const setPassword = useSetPassword()
  const dispatch = useDispatch()

  const submit = (data: SetPasswordData) => {
    setSubmitting(true)
    setPassword(data)
      .then((attendee) => {
        dispatch(setUser(attendee))
      })
      .catch((e) => {
        setResponseError(e)
        setSubmitting(false)
      })
  }

  const password = watch('password')
  return (
    <Container maxWidth="sm">
      <Title>{event.name}</Title>
      <Typography align="center">Please set a password to continue</Typography>
      <form onSubmit={handleSubmit(submit)}>
        <TextField
          label="Password"
          type="password"
          fullWidth
          variant="outlined"
          name="password"
          inputProps={{
            ref: register({
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
            }),
            'aria-label': 'password input',
          }}
          error={!!errors.password}
          helperText={errors.password && errors.password.message}
          disabled={submitting}
        />
        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          variant="outlined"
          name="password_confirmation"
          inputProps={{
            ref: register({
              required: 'Confirm Password is required',
              validate: (value: any) =>
                value === password || 'Passwords are not a match',
            }),
            'aria-label': 'confirm password input',
          }}
          error={!!errors.password_confirmation}
          helperText={
            errors.password_confirmation && errors.password_confirmation.message
          }
          disabled={submitting}
        />
        <Error>{responseError && responseError.message}</Error>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          color="primary"
          disabled={submitting}
          aria-label="submit set password form"
        >
          Submit
        </Button>
      </form>
    </Container>
  )
}

function useSetPassword() {
  const {event, client} = useEvent()
  const url = api(`/events/${event.slug}/password`)

  return (data: SetPasswordData) => client.post<Attendee>(url, data)
}

function Error(props: {children: string | null}) {
  if (!props.children) {
    return null
  }

  return <ErrorText color="error">{props.children}</ErrorText>
}

const Title = styled.h3`
  text-align: center;
`

const ErrorText = withStyles({
  root: {
    marginBottom: spacing[3],
  },
})(Typography)
