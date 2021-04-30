import FormControl from '@material-ui/core/FormControl'
import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import {useAreas} from 'organization/Event/AreasProvider'
import {onUnknownChangeHandler} from 'lib/dom'

export default function AreaSelect(props: {
  onPick: (id: string) => void
  value: string | null
  required?: boolean
}) {
  const {areas: fetchedAreas, loading} = useAreas()
  const areas = fetchedAreas || []

  const hasSelectedArea = !!areas.find((a) => a.key === props.value)
  const value = hasSelectedArea ? props.value : ''

  return (
    <FormControl fullWidth disabled={loading}>
      <InputLabel required={props.required}>Pick an area</InputLabel>
      <Select
        value={value}
        fullWidth
        onChange={onUnknownChangeHandler(props.onPick)}
        label="Source"
        inputProps={{
          'aria-label': 'pick area',
        }}
      >
        {areas.map((area) => (
          <MenuItem
            key={area.key}
            value={area.key}
            aria-label={`pick ${area.name}`}
          >
            {area.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
