import React, {useState} from 'react'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import Button from '@material-ui/core/Button'
import {ObvioEvent} from 'Event'
import {api} from 'lib/url'
import {useEvent} from 'Event/EventProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import {onChangeStringHandler} from 'lib/dom'

export default function TitleField() {
  const {event, update: updateEvent} = useEvent()
  const [title, setTitle] = useState(event.sponsor_page_title)
  const {client} = useOrganization()
  const [processing, setProcessing] = useState(false)
  const hasUpdate = title !== event.sponsor_page_title
  const canSave = Boolean(title) && hasUpdate && !processing

  const save = () => {
    if (processing) {
      return
    }

    setProcessing(true)

    const url = api(`/events/${event.slug}`)
    client
      .put<ObvioEvent>(url, {
        sponsor_page_title: title,
      })
      .then(updateEvent)
      .catch(() => {
        setProcessing(false)
      })
  }

  return (
    <TextField
      value={title}
      focused={canSave}
      variant="outlined"
      fullWidth
      inputProps={{'aria-label': 'sponsor page title'}}
      onChange={onChangeStringHandler(setTitle)}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Button
              onClick={save}
              disabled={!canSave}
              color="primary"
              aria-label="save sponsor page title"
            >
              Save
            </Button>
          </InputAdornment>
        ),
      }}
    />
  )
}
