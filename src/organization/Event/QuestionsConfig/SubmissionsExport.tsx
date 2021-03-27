import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import {useEvent} from 'Event/EventProvider'
import {CsvExport} from 'lib/api-client'
import {api} from 'lib/url'
import React, {useState} from 'react'
import download from 'js-file-download'
import {Typography} from '@material-ui/core'
import {useOrganization} from 'organization/OrganizationProvider'

export default function SubmissionsExport() {
  const {exportSubmissions, error} = useExportSubmissions()

  return (
    <Box mb={3} textAlign="right">
      <Button
        onClick={exportSubmissions}
        variant="outlined"
        aria-label="export submissions"
      >
        Download Answers
      </Button>
      <Error>{error}</Error>
    </Box>
  )
}

function useExportSubmissions() {
  const [error, setError] = useState<string | null>(null)
  const {event} = useEvent()
  const url = api(`/events/${event.slug}/submissions`)
  const {client} = useOrganization()

  const exportSubmissions = () => {
    client
      .get<CsvExport>(url)
      .then((res) => download(res.data, res.file_name))
      .catch((e) => setError(e.message))
  }

  return {exportSubmissions, error}
}

function Error(props: {children: string | null}) {
  if (!props.children) {
    return null
  }

  return <Typography color="error">{props.children}</Typography>
}
