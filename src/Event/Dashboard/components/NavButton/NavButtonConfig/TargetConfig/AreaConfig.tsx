import React from 'react'
import AreaSelect from 'organization/Event/Area/AreaSelect'
import {onChangeStringHandler} from 'lib/dom'
import TextField from '@material-ui/core/TextField'
import {ButtonConfigProps} from 'Event/template/SimpleBlog/Dashboard/MainNav/MainNavButton/MainNavButtonConfig'
import NavButton from 'Event/Dashboard/components/NavButton'

export default function AreaConfig<T extends NavButton>(
  props: ButtonConfigProps<T>,
) {
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
