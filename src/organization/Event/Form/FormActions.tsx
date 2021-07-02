import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import {api} from 'lib/url'
import React, {useState} from 'react'
import Typography from '@material-ui/core/Typography'
import {useOrganization} from 'organization/OrganizationProvider'
import DangerButton from 'lib/ui/Button/DangerButton'
import {useForm} from 'organization/Event/Form/FormProvider'
import {useForms} from 'organization/Event/FormsProvider'
import {useHistory} from 'react-router'
import {useEventRoutes} from 'organization/Event/EventRoutes'
import {useToggle} from 'lib/toggle'

export default function FormActions(props: {className?: string}) {
  const {deleteForm, error} = useDelete()

  return (
    <div className={props.className}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <ExportSubmission />

        <DangerButton
          onClick={deleteForm}
          variant="outlined"
          aria-label="delete form"
        >
          Delete
        </DangerButton>
      </Box>
      <Error>{error}</Error>
    </div>
  )
}

function ExportSubmission() {
  const {form} = useForm()
  const {
    exportSubmissions,
    error,
    successMessage,
    processing,
  } = useSubmissionsExport(`/forms/${form.id}/submissions/export`)

  return (
    <>
      <Button
        onClick={exportSubmissions}
        variant="outlined"
        aria-label="export submissions"
        disabled={processing}
      >
        Download Submissions
      </Button>
      <Error>{error}</Error>
      <Success>{successMessage}</Success>
    </>
  )
}

export function useSubmissionsExport(endpoint: string) {
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const {flag: processing, toggle: toggleProcessing} = useToggle()

  const url = api(endpoint)
  const {client} = useOrganization()

  const exportSubmissions = () => {
    if (processing) {
      return
    }

    toggleProcessing()

    setError(null)
    setSuccessMessage(null)

    client
      .get<{
        message: string
      }>(url)
      .then((res) => {
        setSuccessMessage(res.message)
      })
      .catch((e) => {
        setError(e.message)
      })
      .finally(toggleProcessing)
  }

  return {
    exportSubmissions,
    error,
    successMessage,
    processing,
  }
}

function useDelete() {
  const [error, setError] = useState<string | null>(null)
  const {form} = useForm()
  const {remove} = useForms()
  const url = api(`/forms/${form.id}`)
  const {client} = useOrganization()
  const history = useHistory()
  const eventRoutes = useEventRoutes()

  const deleteForm = () => {
    client
      .delete(url)
      .then(() => {
        remove(form)
        history.push(eventRoutes.forms.root)
      })
      .catch((e) => setError(e.message))
  }

  return {deleteForm, error}
}

function Error(props: {children: string | null}) {
  if (!props.children) {
    return null
  }

  return <Typography color="error">{props.children}</Typography>
}

function Success(props: {children: string | null}) {
  if (!props.children) {
    return null
  }

  return <Typography color="primary">{props.children}</Typography>
}
