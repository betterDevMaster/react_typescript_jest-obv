import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'
import Alert from '@material-ui/lab/Alert'
import withStyles from '@material-ui/core/styles/withStyles'
import {spacing} from 'lib/ui/theme'
import {useEvent} from 'Event/EventProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import {ObvioEvent} from 'Event'
import {useLocalizationConfig} from 'organization/Event/LocalizationConfig'

export default function LocalizationImport() {
  const {isProcessing, setIsProcessing} = useLocalizationConfig()
  const {event, set: setEvent} = useEvent()
  const {client} = useOrganization()

  const [file, setFile] = useState<null | File>(null)
  const [error, setError] = useState('')
  const inputId = 'localization-import-input'

  const handleFileSelect = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files ? evt.target.files[0] : null
    setFile(file)
  }

  const clearError = () => setError('')

  useEffect(() => {
    if (!file || isProcessing) {
      return
    }

    const url = api(`/events/${event.slug}/localization/import`)
    const formData = new FormData()
    formData.set('file', file)

    setIsProcessing(true)
    client
      .post<ObvioEvent>(url, formData, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      })
      .then((result: ObvioEvent) => setEvent(result))
      .catch(() => setError('Error Occured!'))
      .finally(() => {
        setFile(null)
        setIsProcessing(false)
      })
  }, [file, client, event.slug, isProcessing, setIsProcessing, setEvent])

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        aria-label="import localization"
        disabled={isProcessing}
      >
        <ImportButtonLabel htmlFor={inputId}>Import</ImportButtonLabel>
      </Button>
      <input
        id={inputId}
        type="file"
        onChange={handleFileSelect}
        onClick={clearError}
        hidden
        required
        aria-label="localization import input"
      />
      <Error onClose={clearError}>{error}</Error>
    </>
  )
}

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

const ImportButtonLabel = styled.label`
  cursor: pointer;
`

const StyledAlert = withStyles({
  root: {
    marginBottom: spacing[2],
  },
})(Alert)
