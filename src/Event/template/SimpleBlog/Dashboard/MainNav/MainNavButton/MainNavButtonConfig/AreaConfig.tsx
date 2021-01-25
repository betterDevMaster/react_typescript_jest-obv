import FormControl from '@material-ui/core/FormControl'
import {NavButtonWithSize} from 'Event/Dashboard/components/NavButton'
import {onUnknownChangeHandler} from 'lib/dom'
import React from 'react'
import {useAreas} from 'organization/Event/AreaList'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'

export default function AreaConfig(props: {
  button: NavButtonWithSize
  update: <T extends keyof NavButtonWithSize>(
    key: T,
  ) => (value: NavButtonWithSize[T]) => void
}) {
  const {areas: fetchedAreas, loading} = useAreas()
  const areas = fetchedAreas || []

  if (!props.button.isAreaButton) {
    return null
  }

  const hasSelectedArea = !!areas.find((a) => a.id === props.button.areaId)
  const value = hasSelectedArea ? props.button.areaId : ''

  return (
    <FormControl fullWidth disabled={loading}>
      <InputLabel>Pick an area to join</InputLabel>
      <Select
        value={value}
        fullWidth
        onChange={onUnknownChangeHandler(props.update('areaId'))}
        label="Source"
        inputProps={{
          'aria-label': 'pick area',
        }}
      >
        {areas.map((area) => (
          <MenuItem
            key={area.id}
            value={area.id}
            aria-label={`pick ${area.name}`}
          >
            {area.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
