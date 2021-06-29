import React from 'react'
import styled from 'styled-components'
import TextField from '@material-ui/core/TextField'
import {useForm} from 'react-hook-form'
import {useEventAuth} from 'Event/auth'
import {RoomRegistrationFormProps} from 'Event/RoomRegistration/Form'
import {fieldErrors} from 'lib/form'
import ErrorAlert from 'lib/ui/alerts/ErrorAlert'
import Page, {Button} from 'Event/template/Panels/Login/Page'

export default function SimpleBlogRoomRegistrationForm(
  props: RoomRegistrationFormProps,
) {
  const {user} = useEventAuth()
  const {handleSubmit, register, errors: formErrors} = useForm()
  const {responseError, submit, canSubmit} = props

  const errors = fieldErrors({
    formErrors,
    responseError,
  })

  return (
    <Page>
      <>
        <StyledErrorAlert>{responseError?.message}</StyledErrorAlert>
        <form onSubmit={handleSubmit(submit)}>
          <TextField
            label="First name"
            type="text"
            fullWidth
            value={user?.first_name}
            variant="outlined"
            name="first_name"
            inputProps={{
              ref: register({required: 'First name is required.'}),
              'aria-label': 'first name',
            }}
            disabled={!canSubmit}
            error={Boolean(errors.first_name)}
            helperText={errors.first_name}
          />
          <TextField
            label="Last name"
            type="text"
            fullWidth
            value={user?.last_name}
            variant="outlined"
            name="last_name"
            inputProps={{
              ref: register({required: 'Last name is required.'}),
              'aria-label': 'last name',
            }}
            error={Boolean(errors.last_name)}
            helperText={errors.last_name}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            name="email"
            value={user?.email}
            inputProps={{
              ref: register({required: 'Email is required.'}),
              'aria-label': 'email',
            }}
            error={Boolean(errors.email)}
            helperText={errors.email}
            disabled={!canSubmit}
          />
          <Button
            variant="contained"
            fullWidth
            aria-label="join room"
            type="submit"
            disabled={!canSubmit}
          >
            Join room
          </Button>
        </form>
      </>
    </Page>
  )
}

const StyledErrorAlert = styled(ErrorAlert)`
  width: 100%;
  margin-bottom: ${(props) => props.theme.spacing[4]};
`
