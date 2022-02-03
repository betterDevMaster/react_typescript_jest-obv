import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import {onChangeStringHandler} from 'lib/dom'
import {useArea} from 'organization/Event/Area/AreaProvider'
import {
  CONFIGURE_EVENTS,
  usePermissions,
} from 'organization/PermissionsProvider'
import React, {useState, useEffect} from 'react'
import {withStyles} from '@material-ui/core/styles'
import {spacing} from 'lib/ui/theme'
import Typography from '@material-ui/core/Typography'

export default function NameField() {
  const {area, update, processing} = useArea()
  const [name, setName] = useState(area.name)

  useEffect(() => {
    setName(area.name)
  }, [area])

  const {can} = usePermissions()

  if (!can(CONFIGURE_EVENTS)) {
    return <Title variant="h5">{area.name}</Title>
  }

  const save = () => update({name})

  return (
    <TextField
      value={name}
      fullWidth
      onChange={onChangeStringHandler(setName)}
      variant="outlined"
      label="Name"
      disabled={processing}
      inputProps={{
        'aria-label': 'area name',
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Button
              aria-label="save name"
              onClick={save}
              color="primary"
              disabled={processing}
            >
              Save
            </Button>
          </InputAdornment>
        ),
      }}
    />
  )
}

const Title = withStyles({
  root: {
    marginBottom: spacing[4],
  },
})(Typography)
