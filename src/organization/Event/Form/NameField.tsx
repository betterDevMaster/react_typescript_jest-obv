import React, {useState} from 'react'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import Button from '@material-ui/core/Button'
import {onChangeStringHandler} from 'lib/dom'
import {useForm} from 'organization/Event/Form/FormProvider'

export default function NameField() {
  const {form, update, processing} = useForm()
  const [name, setName] = useState(form.name)
  const hasUpdate = name !== form.name
  const canSave = Boolean(name) && hasUpdate && !processing

  const save = () => {
    update('name')(name)
  }

  return (
    <TextField
      value={name}
      focused={canSave}
      variant="outlined"
      fullWidth
      inputProps={{'aria-label': 'form name'}}
      onChange={onChangeStringHandler(setName)}
      disabled={processing}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Button
              onClick={save}
              disabled={!canSave}
              color="primary"
              aria-label="save name"
            >
              Save
            </Button>
          </InputAdornment>
        ),
      }}
    />
  )
}
