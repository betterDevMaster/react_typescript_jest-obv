import React, {useEffect} from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import {MenuItemActionProps} from 'organization/Event/AttendeeManagement/AttendeeTools'
import {useGet} from 'lib/requests'
import {useOrganization} from 'organization/OrganizationProvider'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'

export default function DownloadWaiversMenuItem(
  props: MenuItemActionProps & {
    disabled?: boolean
    onClick: () => void
  },
) {
  return (
    <MenuItem
      onClick={props.onClick}
      disabled={props.disabled}
      aria-label="export waivers"
    >
      Download Waivers
    </MenuItem>
  )
}

export function useDownloadWaivers(
  onSuccess: (message: string) => void,
  onError: (message: string) => void,
) {
  const {event} = useEvent()
  const url = api(`/events/${event.slug}/waivers/export`)

  const {client} = useOrganization()

  const {
    send: downloadWaivers,
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

  return {processing, downloadWaivers}
}
