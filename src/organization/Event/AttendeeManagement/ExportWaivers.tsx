import React from 'react'
import styled from 'styled-components'
import withStyles from '@material-ui/core/styles/withStyles'
import Button from '@material-ui/core/Button'
import {spacing} from 'lib/ui/theme'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import {useGet} from 'lib/requests'
import {useOrganization} from 'organization/OrganizationProvider'
import ErrorAlert from 'lib/ui/alerts/ErrorAlert'
import SuccessAlert from 'lib/ui/alerts/SuccessAlert'

export default function ExportWaivers() {
  const {event} = useEvent()

  const url = api(`/events/${event.slug}/waivers/export`)

  const {client} = useOrganization()

  const {
    send: exportWaivers,
    processing,
    errorMessage,
    successMessage,
  } = useGet(client, url)

  return (
    <>
      <ExportWaiversButton
        variant="outlined"
        color="primary"
        aria-label="export waivers"
        onClick={exportWaivers}
        disabled={processing}
      >
        Export Waivers
      </ExportWaiversButton>
      <StyledErrorAlert>{errorMessage}</StyledErrorAlert>
      <StyledSuccessAlert>{successMessage}</StyledSuccessAlert>
    </>
  )
}

const ExportWaiversButton = withStyles({
  root: {
    marginLeft: spacing[2],
  },
})(Button)

const StyledErrorAlert = styled(ErrorAlert)`
  margin-top: ${(props) => props.theme.spacing[2]};
`

const StyledSuccessAlert = styled(SuccessAlert)`
  margin-top: ${(props) => props.theme.spacing[2]};
`
