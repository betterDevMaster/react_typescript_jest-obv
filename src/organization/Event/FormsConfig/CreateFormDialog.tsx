import Button from '@material-ui/core/Button'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import {withStyles} from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import {useEvent} from 'Event/EventProvider'
import {ValidationError} from 'lib/api-client'
import {fieldError} from 'lib/form'
import Dialog from 'lib/ui/Dialog'
import {spacing} from 'lib/ui/theme'
import {api} from 'lib/url'
import {Form, useForms} from 'organization/Event/FormsProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import React, {useState} from 'react'
import {useForm} from 'react-hook-form'

interface CreateFormData {
  name: string
}

export default function CreateFormDialog(props: {
  isVisible: boolean
  onClose: () => void
}) {
  const create = useCreate()

  const [processing, setProcessing] = useState(false)
  const [responseError, setResponseError] = useState<
    ValidationError<CreateFormData>
  >(null)
  const {add} = useForms()

  const {handleSubmit, register, errors} = useForm()

  const submit = (data: CreateFormData) => {
    if (processing) {
      return
    }

    setProcessing(true)

    create(data)
      .then((form) => {
        add(form)
        props.onClose()
      })
      .catch((e) => {
        setResponseError(e)
      })
      .finally(() => {
        setProcessing(false)
      })
  }

  const nameError = fieldError('name', {
    form: errors,
    response: responseError,
  })

  return (
    <Dialog open={props.isVisible} onClose={props.onClose}>
      <DialogTitle>Add Form</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(submit)}>
          <TextField
            label="Name"
            fullWidth
            name="name"
            inputProps={{
              ref: register,
              'aria-label': 'form name',
            }}
            helperText={nameError}
            error={!!nameError}
            disabled={processing}
            required
          />
          <CreateButton
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            disabled={processing}
            aria-label="create"
          >
            Create
          </CreateButton>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function useCreate() {
  const {event} = useEvent()
  const {client} = useOrganization()

  return (data: CreateFormData) => {
    const url = api(`/events/${event.slug}/forms`)
    return client.post<Form>(url, data)
  }
}

const CreateButton = withStyles({
  root: {
    marginBottom: spacing[4],
  },
})(Button)
