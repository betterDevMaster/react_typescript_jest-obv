import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import {Downloadable} from 'lib/api-client'
import {api} from 'lib/url'
import React, {useState} from 'react'
import download from 'js-file-download'
import {Typography} from '@material-ui/core'
import {useOrganization} from 'organization/OrganizationProvider'
import DangerButton from 'lib/ui/Button/DangerButton'
import {useForm} from 'organization/Event/Form/FormProvider'
import {useForms} from 'organization/Event/FormsProvider'
import {useHistory} from 'react-router'
import {useEventRoutes} from 'organization/Event/EventRoutes'

export default function FormActions(props: {className?: string}) {
  const {exportSubmissions, error: downloadError} = useExportSubmissions()
  const {deleteForm, error: deleteError} = useDelete()

  const error = downloadError || deleteError

  return (
    <div className={props.className}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Button
          onClick={exportSubmissions}
          variant="outlined"
          aria-label="export submissions"
        >
          Download Submissions
        </Button>
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

function useExportSubmissions() {
  const [error, setError] = useState<string | null>(null)
  const {form} = useForm()
  const url = api(`/forms/${form.id}/submissions/export`)
  const {client} = useOrganization()

  const exportSubmissions = () => {
    client
      .get<Downloadable>(url)
      .then((res) => download(res.data, res.file_name))
      .catch((e) => setError(e.message))
  }

  return {exportSubmissions, error}
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
