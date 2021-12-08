import React from 'react'
import Button from '@material-ui/core/Button'
import withStyles from '@material-ui/core/styles/withStyles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import {ValidationError} from 'lib/ui/api-client'
import {spacing} from 'lib/ui/theme'
import {UseFormMethods} from 'react-hook-form'
import {Data} from 'organization/Settings'
import {useOrganization} from 'organization/OrganizationProvider'

export default function Form(props: {
  onSubmit: () => void
  register: UseFormMethods['register']
  nameError?: string
  submitting: boolean
  serverError: ValidationError<Data>
}) {
  const {onSubmit, register, submitting, nameError, serverError} = props

  const {organization} = useOrganization()

  return (
    <form onSubmit={onSubmit}>
      <TextField
        label="Organization Name"
        name="name"
        required
        fullWidth
        variant="outlined"
        inputProps={{
          ref: register({
            required: 'Name is required',
          }),
          'aria-label': 'organization name',
        }}
        error={!!nameError}
        helperText={nameError}
        disabled={submitting}
        defaultValue={organization.name}
      />
      <Error>{serverError && serverError.message}</Error>
      <Button
        type="submit"
        variant="contained"
        fullWidth
        color="primary"
        size="large"
        disabled={submitting}
        aria-label="update"
      >
        Submit
      </Button>
    </form>
  )
}

function Error(props: {children: string | null}) {
  if (!props.children) {
    return null
  }

  return <ErrorText color="error">{props.children}</ErrorText>
}
const ErrorText = withStyles({
  root: {
    marginBottom: spacing[3],
  },
})(Typography)
