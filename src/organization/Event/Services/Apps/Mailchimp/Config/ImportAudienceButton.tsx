import React from 'react'
import {useEvent} from 'Event/EventProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import {useToggle} from 'lib/toggle'
import Button from '@material-ui/core/Button'

export const IMPORT_STARTED_MESSAGE =
  'Mailchimp attendees import has started. Depending on the number of members this could take up to 20 minutes.'

export default function ImportAudienceButton(props: {
  onSuccess: (message: string | null) => void
}) {
  const {importAudience: startImport, processing} = useImportAudience(
    props.onSuccess,
  )

  return (
    <Button
      onClick={startImport}
      disabled={processing}
      color="primary"
      variant="contained"
    >
      Import Audience
    </Button>
  )
}

export function useImportAudience(onSuccess: (message: string | null) => void) {
  const {event} = useEvent()
  const {client} = useOrganization()
  const {flag: processing, toggle: toggleProcessing} = useToggle()

  const importAudience = () => {
    if (processing) {
      return
    }

    toggleProcessing()
    const url = api(
      `/events/${event.slug}/integrations/mailchimp/audiences/import`,
    )
    client
      .post(url)
      .then(() => {
        onSuccess(IMPORT_STARTED_MESSAGE)
      })
      .finally(toggleProcessing)
  }

  return {
    importAudience,
    processing,
  }
}
