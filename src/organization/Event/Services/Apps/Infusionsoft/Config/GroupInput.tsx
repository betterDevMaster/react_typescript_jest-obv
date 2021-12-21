import TextField from '@material-ui/core/TextField'
import styled from 'styled-components'
import CloseIcon from '@material-ui/icons/Close'
import React from 'react'
import {InfusionsoftGroup} from 'organization/Event/Services/Apps/Infusionsoft/index'
import Grid from '@material-ui/core/Grid'
import {onChangeStringHandler} from 'lib/dom'
import FieldAutoComplete, {
  Field,
} from 'organization/Event/Services/Apps/Infusionsoft/Config/FieldAutocomplete'
import IconButton from 'lib/ui/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'

export default function GroupInput(props: {
  group: InfusionsoftGroup
  onChange: (group: InfusionsoftGroup) => void
  onRemove: () => void
}) {
  const {onChange, group, onRemove} = props
  const update = <K extends keyof InfusionsoftGroup>(key: K) => (
    value: InfusionsoftGroup[K],
  ) => {
    const updated = {
      ...group,
      [key]: value,
    }

    onChange(updated)
  }

  const setField = (field: Field | null) => {
    const updated = {
      ...group,
      infusionsoft_field_label: field?.label || null,
      infusionsoft_field_name: field?.name || null,
    }

    onChange(updated)
  }

  return (
    <Grid container spacing={2}>
      <Grid item sm={6}>
        <TextField
          label="Key"
          value={group.key}
          fullWidth
          variant="outlined"
          inputProps={{'aria-label': 'group name'}}
          onChange={onChangeStringHandler(update('key'))}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <RemoveButton aria-label="remove group" onClick={onRemove}>
                  <CloseIcon color="error" />
                </RemoveButton>
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item sm={6}>
        <FieldAutoComplete
          onChange={setField}
          value={{
            label: group.infusionsoft_field_label || '',
            name: group.infusionsoft_field_name || '',
          }}
          label="Infusionsoft Field"
        />
      </Grid>
    </Grid>
  )
}

const RemoveButton = styled(IconButton)`
  margin-left: ${(props) => props.theme.spacing[2]};
`
