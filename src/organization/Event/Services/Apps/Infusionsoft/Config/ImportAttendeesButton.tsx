import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import React from 'react'
import Button from '@material-ui/core/Button'
import {
  useInfusionsoft,
  useServices,
} from 'organization/Event/Services/ServicesProvider'
import {InfusionsoftIntegration} from 'organization/Event/Services/Apps/Infusionsoft'
import {useToggle} from 'lib/toggle'

export default function ImportAttendeesButton(props: {
  onSuccess: () => void
  onError: (error: string) => void
}) {
  const {update: updateIntegration} = useServices()
  const importAttendees = useImportUsers()
  const infusionsoft = useInfusionsoft()
  const {flag: processing, toggle: toggleProcessing} = useToggle()

  const handleImport = () => {
    if (processing) {
      return
    }

    toggleProcessing()

    importAttendees()
      .then((integration) => {
        updateIntegration(integration)
        props.onSuccess()
      })
      .catch((e) => {
        props.onError(e.message)
      })
      .finally(() => {
        toggleProcessing()
      })
  }

  const canImport =
    !processing &&
    infusionsoft.can_import_attendees &&
    infusionsoft.has_set_import_tag

  return (
    <Button
      variant="outlined"
      color="primary"
      aria-label="import attendees"
      onClick={handleImport}
      disabled={!canImport}
    >
      Import Attendees
    </Button>
  )
}

function useImportUsers() {
  const {client} = useOrganization()
  const {event} = useEvent()
  const url = api(
    `/events/${event.slug}/integrations/infusionsoft/import_attendees`,
  )

  return () => client.post<InfusionsoftIntegration>(url)
}
