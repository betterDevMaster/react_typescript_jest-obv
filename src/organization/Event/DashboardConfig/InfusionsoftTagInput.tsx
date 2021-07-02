import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import {useEvent} from 'Event/EventProvider'
import {InfusionsoftTag} from 'Event/infusionsoft'
import {onChangeStringHandler} from 'lib/dom'
import DangerButton from 'lib/ui/Button/DangerButton'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import React, {useEffect, useState} from 'react'

export default function InfusionsoftTagInput(props: {
  onChange: (tag: InfusionsoftTag | null) => void
  value?: InfusionsoftTag | null
  disabled?: boolean
}) {
  const {value} = props
  const {event} = useEvent()
  const [id, setId] = useState('')
  const getTagName = useGetTagName()
  const [failed, setFailed] = useState(false)
  const [processing, setProcessing] = useState(false)

  const hasChanges = parseInt(id) !== value?.id
  const canSet = Boolean(id) && hasChanges && !processing
  const canClear = Boolean(id) && !hasChanges

  useEffect(() => {
    if (!value) {
      return
    }

    setId(String(value.id))
  }, [value])

  useEffect(() => {
    setFailed(false)
  }, [id])

  const label = value ? `Infusionsoft - ${value.name}` : 'Infusionsoft Tag ID'

  const set = () => {
    if (!canSet) {
      return
    }

    setProcessing(true)
    setFailed(false)

    getTagName(id)
      .then(({name}) => {
        const tag: InfusionsoftTag = {
          name,
          id: parseInt(id),
        }

        props.onChange(tag)
      })
      .catch(() => {
        setFailed(true)
      })
      .finally(() => {
        setProcessing(false)
      })
  }

  const clear = () => {
    setId('')
    props.onChange(null)
  }

  if (!event.has_infusionsoft) {
    return null
  }

  const helperText = failed ? 'Invalid tag ID' : ''

  return (
    <TextField
      value={id}
      label={label}
      fullWidth
      inputProps={{
        'aria-label': 'infusionsoft tag id',
      }}
      onChange={onChangeStringHandler(setId)}
      error={failed}
      disabled={processing || props.disabled}
      helperText={helperText}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <ActionButton
              canSet={canSet}
              set={set}
              canClear={canClear}
              clear={clear}
            />
          </InputAdornment>
        ),
      }}
    />
  )
}

function ActionButton(props: {
  canSet: boolean
  set: () => void
  canClear: boolean
  clear: () => void
}) {
  if (props.canClear) {
    return (
      <DangerButton
        onClick={props.clear}
        aria-label="clear tag id"
        variant="text"
      >
        Clear
      </DangerButton>
    )
  }

  return (
    <Button
      onClick={props.set}
      color="primary"
      aria-label="set tag id"
      disabled={!props.canSet}
      size="small"
      variant="text"
    >
      Set
    </Button>
  )
}

function useGetTagName() {
  const {client} = useOrganization()
  const {event} = useEvent()

  return (id: string) => {
    const url = api(
      `/events/${event.slug}/integrations/infusionsoft/tag_name/${id}`,
    )

    return client.get<{name: string}>(url)
  }
}
