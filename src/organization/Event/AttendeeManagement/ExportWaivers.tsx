import React, {useEffect} from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import Button from '@material-ui/core/Button'
import {spacing} from 'lib/ui/theme'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import {useGet} from 'lib/requests'
import {useOrganization} from 'organization/OrganizationProvider'

export default function ExportWaivers(props: {
  onSuccess: (message: string | null) => void
  onError: (message: string | null) => void
}) {
  const {onSuccess, onError} = props
  const {event} = useEvent()

  const url = api(`/events/${event.slug}/waivers/export`)

  const {client} = useOrganization()

  const {
    send: exportWaivers,
    processing,
    errorMessage,
    successMessage,
  } = useGet(client, url)

  useEffect(() => {
    if (successMessage) {
      onSuccess(successMessage)
      return
    }

    if (errorMessage) {
      onError(errorMessage)
    }
  }, [successMessage, errorMessage, onSuccess, onError])

  return (
    <ExportWaiversButton
      variant="outlined"
      color="primary"
      aria-label="export waivers"
      onClick={exportWaivers}
      disabled={processing}
    >
      Export Waivers
    </ExportWaiversButton>
  )
}

const ExportWaiversButton = withStyles({
  root: {
    marginLeft: spacing[2],
  },
})(Button)
