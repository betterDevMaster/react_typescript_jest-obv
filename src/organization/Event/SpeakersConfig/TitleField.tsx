import React, {useState} from 'react'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import Button from '@material-ui/core/Button'
import {ObvioEvent, SpeakerPage} from 'Event'
import {api} from 'lib/url'
import {useEvent} from 'Event/EventProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import {onChangeStringHandler} from 'lib/dom'

export default function TitleField(props: {page: SpeakerPage}) {
  const [title, setTitle] = useState(props.page.title)
  const {event, set: setEvent} = useEvent()
  const {client} = useOrganization()
  const [processing, setProcessing] = useState(false)
  const hasUpdate = title !== props.page.title
  const canSave = Boolean(title) && hasUpdate && !processing

  const save = () => {
    if (processing) {
      return
    }

    setProcessing(true)

    const url = api(`/events/${event.slug}/speaker_page`)
    client
      .post<ObvioEvent>(url, {
        title,
      })
      .then(setEvent)
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
      inputProps={{'aria-label': 'speaker page title'}}
      onChange={onChangeStringHandler(setTitle)}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Button onClick={save} disabled={!canSave} color="primary">
              Save
            </Button>
          </InputAdornment>
        ),
      }}
    />
  )
}
