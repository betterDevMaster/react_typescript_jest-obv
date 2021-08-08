import React, {useState} from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import Button from '@material-ui/core/Button'
import Alert from '@material-ui/lab/Alert'
import {spacing} from 'lib/ui/theme'
import download from 'js-file-download'
import {Downloadable} from 'lib/api-client'
import {useEvent} from 'Event/EventProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import {useLocalizationConfig} from 'organization/Event/LocalizationConfig'

export default function LocalizationExport() {
  const {event} = useEvent()
  const {client} = useOrganization()
  const {isProcessing, setIsProcessing} = useLocalizationConfig()
  const [error, setError] = useState('')
  const updateError = (error: string) => setError(error)
  const clearError = () => setError('')

  const exportLoalization = () => {
    if (isProcessing) {
      return
    }

    setIsProcessing(true)

    const url = api(`/events/${event.slug}/localization/export `)
    client
      .get<Downloadable>(url)
      .then((res) => download(res.data, res.file_name))
      .catch((e) => updateError(e.message))
      .finally(() => {
        setIsProcessing(false)
      })
  }

  return (
    <>
      <ExportButton
        variant="outlined"
        color="primary"
        aria-label="export localization"
        onClick={exportLoalization}
        disabled={isProcessing}
      >
        Export
      </ExportButton>
      <Error onClose={clearError}>{error}</Error>
    </>
  )
}

const ExportButton = withStyles({
  root: {
    marginRight: spacing[2],
  },
})(Button)

function Error(props: {children: string | null; onClose: () => void}) {
  if (!props.children) {
    return null
  }

  return (
    <StyledAlert severity="error" onClose={props.onClose}>
      {props.children}
    </StyledAlert>
  )
}

const StyledAlert = withStyles({
  root: {
    marginBottom: spacing[2],
  },
})(Alert)
