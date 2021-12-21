import {useEvent} from 'Event/EventProvider'
import Button from '@material-ui/core/Button'
import {InfusionsoftTag} from 'Event/infusionsoft'
import React, {useEffect, useState} from 'react'
import TagsAutocomplete from 'organization/Event/Services/Apps/Infusionsoft/Config/TagsAutocomplete'
import CircularProgress from '@material-ui/core/CircularProgress'
import InputAdornment from '@material-ui/core/InputAdornment'
import DangerButton from 'lib/ui/Button/DangerButton'

export default function InfusionsoftTagInput(props: {
  onChange: (tag: InfusionsoftTag | null) => void
  value?: InfusionsoftTag | null
  disabled?: boolean
}) {
  const {value, disabled} = props

  const [current, setCurrent] = useState(value)
  const {event} = useEvent()
  const clear = () => {
    props.onChange(null)
  }

  useEffect(() => {
    setCurrent(value)
  }, [value])

  const label = value ? `Infusionsoft - ${value.name}` : 'Infusionsoft Tag ID'
  const hasChanges = value?.name !== current?.name
  const canSave = Boolean(current) && hasChanges && !disabled
  const canClear = Boolean(current) && !hasChanges

  const save = () => {
    props.onChange(current || null)
  }

  if (!event.has_infusionsoft) {
    return null
  }

  return (
    <TagsAutocomplete
      inputLabel={label}
      value={current}
      onChange={setCurrent}
      disabled={props.disabled}
      saveButtonText={'Set'}
      endAdornment={(loading, arrow) => (
        <>
          {loading ? <CircularProgress color="inherit" size={20} /> : null}
          {arrow}
          <InputAdornment position="end">
            <ClearButton showing={canClear} onClick={clear} />
            <SetButton showing={!canClear} onClick={save} disabled={!canSave} />
          </InputAdornment>
        </>
      )}
    />
  )
}

function ClearButton(props: {
  onClick: () => void
  showing: boolean | undefined
}) {
  if (!props.showing) {
    return null
  }

  return (
    <DangerButton
      onClick={props.onClick}
      aria-label="clear tag id"
      variant="text"
    >
      Clear
    </DangerButton>
  )
}

function SetButton(props: {
  disabled: boolean
  onClick: () => void
  showing: boolean | undefined
}) {
  if (!props.showing) {
    return null
  }

  return (
    <Button
      onClick={props.onClick}
      color="primary"
      aria-label="save tag id"
      disabled={props.disabled}
      size="small"
      variant="text"
    >
      Set
    </Button>
  )
}
