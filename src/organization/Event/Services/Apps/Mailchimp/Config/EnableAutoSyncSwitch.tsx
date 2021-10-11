import React from 'react'
import {useServices} from 'organization/Event/Services/ServicesProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import {useEvent} from 'Event/EventProvider'
import {onChangeCheckedHandler} from 'lib/dom'
import {
  MailchimpIntegration,
  useMailchimp,
} from 'organization/Event/Services/Apps/Mailchimp/index'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import {useToggle} from 'lib/toggle'

export default function EnableAutoSyncSwitch() {
  const {auto_sync_tags_enabled} = useMailchimp()
  const {flag: processing, toggle: toggleProcessing} = useToggle()

  const enable = useEnable()
  const disable = useDisable()

  const handleToggle = (enabled: boolean) => {
    const request = enabled ? enable : disable

    if (processing) {
      return
    }

    toggleProcessing()
    request().finally(toggleProcessing)
  }

  return (
    <FormControlLabel
      control={
        <Switch
          disabled={processing}
          checked={auto_sync_tags_enabled}
          onChange={onChangeCheckedHandler(handleToggle)}
          color="primary"
          inputProps={{
            'aria-label': 'toggle auto sync tags',
          }}
        />
      }
      label="Auto-Sync Tags Enabled"
    />
  )
}

function useEnable() {
  const {client} = useOrganization()
  const {event} = useEvent()
  const {update} = useServices()

  const url = api(`/events/${event.slug}/integrations/mailchimp/tags/sync`)
  return () => client.put<MailchimpIntegration>(url).then(update)
}

function useDisable() {
  const {client} = useOrganization()
  const {event} = useEvent()
  const {update} = useServices()

  const url = api(`/events/${event.slug}/integrations/mailchimp/tags/sync`)
  return () => client.delete<MailchimpIntegration>(url).then(update)
}
