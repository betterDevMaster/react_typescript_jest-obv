import {TextField} from '@material-ui/core'
import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment'
import {onChangeStringHandler} from 'lib/dom'
import {
  ATTENDEE_CREATED,
  ATTENDEE_CHECKED_IN,
  ATTENDEE_SIGNED_WAIVER,
  Tag,
} from 'organization/Event/Services/Apps/Infusionsoft'
import React, {useEffect, useState} from 'react'

export default function TagIdInput(props: {
  tag: Tag
  onChange: (infusionsoftId: string) => void
}) {
  const {tag} = props
  const [infusionsoftId, setInfusionsoftId] = useState('')

  useEffect(() => {
    setInfusionsoftId(tag.infusionsoft_id ? String(tag.infusionsoft_id) : '')
  }, [tag])

  const hasChanges = infusionsoftId !== String(tag.infusionsoft_id)
  const canSave = Boolean(infusionsoftId) && hasChanges

  const save = () => {
    props.onChange(String(infusionsoftId))
  }

  return (
    <TextField
      value={infusionsoftId}
      onChange={onChangeStringHandler(setInfusionsoftId)}
      variant="outlined"
      label={label(tag)}
      fullWidth
      inputProps={{
        'aria-label': 'tag id',
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Button
              onClick={save}
              disabled={!canSave}
              color="primary"
              aria-label="save tag id"
            >
              Save
            </Button>
          </InputAdornment>
        ),
      }}
    />
  )
}

function label(tag: Tag) {
  const isSet = Boolean(tag.name)

  return isSet ? `${typeLabel(tag)} - ${tag.name}` : `${typeLabel(tag)}`
}

function typeLabel(tag: Tag) {
  const labels: Record<string, string> = {
    [ATTENDEE_CREATED]: 'Attendee Created',
    [ATTENDEE_SIGNED_WAIVER]: 'Attendee Signed Waiver',
    [ATTENDEE_CHECKED_IN]: 'Attendee Checked In',
  }

  const label = labels[tag.type]
  if (!label) {
    throw new Error(`Label not defined for tag type: ${tag.type}`)
  }

  return label
}
