import React from 'react'
import {
  Button,
  Description,
  TextField,
  ErrorMessage,
} from 'Event/template/SimpleBlog/Login/Page'
import Container from '@material-ui/core/Container'
import Page from 'Event/template/SimpleBlog/Page'
import {useAttendee} from 'Event/auth'
import {ChangePasswordRequest} from 'auth/password/change'
import {useHistory} from 'react-router-dom'
import {eventRoutes} from 'Event/Routes'

export default function ChangePassword(props: {
  changePassword: ChangePasswordRequest
}) {
  const user = useAttendee()

  return (
    <Page user={user}>
      <Content {...props} />
    </Page>
  )
}

function Content(props: {changePassword: ChangePasswordRequest}) {
  const {changePassword} = props
  const {register, submitting, errors, responseError} = changePassword
  const history = useHistory()
  const goBackToDashboard = () => {
    history.push(eventRoutes.root)
  }

  if (changePassword.wasSuccessful) {
    return (
      <>
        <Description>Password Updated!</Description>
        <Button
          variant="contained"
          fullWidth
          aria-label="back to dashboard"
          type="submit"
          onClick={goBackToDashboard}
        >
          Go To Dashboard
        </Button>
      </>
    )
  }

  return (
    <>
      <Container maxWidth="md">
        <Description>Let's get you a new password</Description>
        <form onSubmit={changePassword.onSubmit}>
          <TextField
            label="New Password"
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
            helperText={errors.password}
          />
          <TextField
            label="Confirm New Password"
            type="password"
            fullWidth
            variant="outlined"
            name="password_confirmation"
            disabled={submitting}
            inputProps={{
              ref: register({
                required: 'Password confirmation is required',
              }),
              'aria-label': 'password confirmation',
            }}
            error={!!errors.password_confirmation}
            helperText={errors.password_confirmation}
          />
          <ErrorMessage>{responseError?.message}</ErrorMessage>
          <Button
            variant="contained"
            fullWidth
            disabled={submitting}
            aria-label="submit"
            type="submit"
          >
            Change password
          </Button>
        </form>
      </Container>
    </>
  )
}
