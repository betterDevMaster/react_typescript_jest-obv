import {NavButtonWithSize} from 'Event/Dashboard/components/NavButton'
import React from 'react'
import AreaSelect from 'organization/Event/Area/AreaSelect'
import {onChangeStringHandler} from 'lib/dom'
import TextField from '@material-ui/core/TextField'

export default function AreaConfig(props: {
  button: NavButtonWithSize
  update: <T extends keyof NavButtonWithSize>(
    key: T,
  ) => (value: NavButtonWithSize[T]) => void
}) {
  const {button, update} = props
  if (!button.isAreaButton) {
    return null
  }

  return (
    <>
      <AreaSelect value={button.areaId} onPick={update('areaId')} />
      <TextField
        value={button.offlineTitle || ''}
        label="Offline Title"
        fullWidth
        inputProps={{
          'aria-label': 'main nav button offline title',
        }}
        onChange={onChangeStringHandler(update('offlineTitle'))}
      />
      <TextField
        value={button.offlineDescription || ''}
        label="Offline Description"
        fullWidth
        inputProps={{
          'aria-label': 'main nav button offline description',
        }}
        multiline
        rows="2"
        onChange={onChangeStringHandler(update('offlineDescription'))}
      />
    </>
  )
}
